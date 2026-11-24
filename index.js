/**
 * Host half of DeepRead.
 *
 * The browser half cannot read files from disk or call the web providers, so
 * this half owns three narrow Host capabilities:
 *
 *  - store an uploaded PDF and turn it into page images plus positioned words
 *    with the locally installed Poppler tools (`pdftoppm`, `pdftotext`);
 *  - proxy a web search through the composed `ctx.web` provider;
 *  - proxy one top-level web navigation at a time so a study page can be read
 *    beside the conversation, with a small bridge that reports selections;
 *  - deliver a selected PDF passage or web passage to the live conversation as
 *    a normal user message, so the real session answers it.
 *
 * Everything is served from one same-origin prefix route. The route accepts
 * only our stored document ids and page numbers; it never accepts a path
 * from the browser.
 */
import { createHash, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { mkdir, open, readFile, rename, rm, stat, writeFile, access } from 'node:fs/promises'
import { once } from 'node:events'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { finished } from 'node:stream/promises'
import { promisify } from 'node:util'

const exec = promisify(execFile)

/** The single prefix the browser half uses. */
export const ROUTE = '/dsh-deepread/api'

const MAX_PDF_BYTES = 80 * 1024 * 1024
const MAX_JSON_BYTES = 1024 * 1024
const MAX_TEXT_OUTPUT = 64 * 1024 * 1024
const MAX_SELECTION = 12_000
const MAX_QUESTION = 2_000
const PAGE_DPI = 130
const MAX_PAGE_BYTES = 12 * 1024 * 1024
const FETCH_TIMEOUT_MS = 25_000

/** The proxied document's own sandbox, combined with the iframe's attribute. */
const PAGE_POLICY = "sandbox allow-scripts allow-forms; default-src 'none'; img-src * data: blob:; "
  + "style-src * 'unsafe-inline'; font-src * data:; script-src * 'unsafe-inline' 'unsafe-eval'; "
  + "connect-src *; media-src * data: blob:; frame-src *; child-src *; form-action *; base-uri *"

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]', '::1', '0.0.0.0'])
const OPEN_INTERVAL_MS = 1_200
const openGate = { at: 0 }
const HTML_TYPE = /^text\/html\b|^application\/xhtml\+xml\b/i

/** PDFKit's outline reader, run through the system JavaScript bridge. */
const OUTLINE_SCRIPT = String.raw`
ObjC.import('Foundation');
ObjC.import('PDFKit');
function run(argv) {
  try {
    if (!argv || argv.length === 0) return JSON.stringify({ outline: [], error: 'missing path' });
    const url = $.NSURL.fileURLWithPath(argv[0]);
    const doc = $.PDFDocument.alloc.initWithURL(url);
    if (!doc || doc.isNil()) return JSON.stringify({ outline: [], error: 'cannot open PDF' });
    const root = doc.outlineRoot;
    if (!root || root.isNil()) return JSON.stringify({ outline: [] });
    const rows = [];
    function text(value) {
      try {
        const unwrapped = ObjC.unwrap(value);
        return unwrapped === undefined || unwrapped === null ? '' : String(unwrapped);
      } catch (_) {
        return '';
      }
    }
    function walk(node, depth) {
      let page = 0;
      try {
        const dest = node.destination;
        if (dest && !dest.isNil()) {
          const p = dest.page;
          if (p && !p.isNil()) page = Number(doc.indexForPage(p)) + 1;
        }
      } catch (_) {
        page = 0;
      }
      rows.push({ title: text(node.label), page: page, depth: depth });
      const count = Number(node.numberOfChildren);
      for (let i = 0; i < count; i++) {
        const child = node.childAtIndex(i);
        if (child && !child.isNil()) walk(child, depth + 1);
      }
    }
    const count = Number(root.numberOfChildren);
    for (let i = 0; i < count; i++) {
      const child = root.childAtIndex(i);
      if (child && !child.isNil()) walk(child, 0);
    }
    return JSON.stringify({ outline: rows });
  } catch (error) {
    return JSON.stringify({ outline: [], error: String(error) });
  }
}
`;

const DOC_ID = /^[a-f0-9]{24}$/
const IMAGE_CACHE_LIMIT = 24

export const inject = ['webServer', 'web', 'agents']

function rootDir() {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'deepread')
}

/** Poppler is often installed by Homebrew and is absent from a Finder-launched PATH. */
const toolCache = new Map()

async function toolPath(name) {
  const cached = toolCache.get(name)
  if (cached !== undefined) return cached
  const directories = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin']
  for (const directory of directories) {
    const candidate = join(directory, name)
    try {
      await access(candidate)
      toolCache.set(name, candidate)
      return candidate
    } catch {
      // Try the next well-known directory.
    }
  }
  toolCache.set(name, name)
  return name
}

async function runTool(name, args, options) {
  try {
    return await exec(await toolPath(name), args, options)
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw httpError(501, 'Poppler tools are required (pdfinfo, pdftotext, pdftoppm)')
    }
    throw error
  }
}

function httpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

function sendJson(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  res.end(body)
}

function sendPng(res, bytes) {
  res.writeHead(200, {
    'content-type': 'image/png',
    'content-length': bytes.length,
    'cache-control': 'private, max-age=3600',
    'x-content-type-options': 'nosniff',
  })
  res.end(bytes)
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_JSON_BYTES) {
        reject(httpError(413, 'request body is too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(httpError(400, 'request body is not JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendHtml(res, status, html) {
  const body = Buffer.from(html, 'utf8')
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': body.length,
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
    'content-security-policy': PAGE_POLICY,
  })
  res.end(body)
}

function sendRelay(res, status, contentType, bytes) {
  res.writeHead(status, {
    'content-type': contentType,
    'content-length': bytes.length,
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
    'content-security-policy': PAGE_POLICY,
  })
  res.end(bytes)
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttribute(value) {
  return escapeText(value).replace(/'/g, '&#39;')
}

/** Collapse a page-provided line so it cannot leave the quoted passage. */
function plainLine(value, max) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function isLoopbackHost(hostname) {
  return LOOPBACK_HOSTS.has(String(hostname).toLowerCase())
}

/** True when `url` addresses this application, including its loopback aliases. */
function isAppAddress(url, appOrigin) {
  if (url.origin === appOrigin) return true
  let app
  try {
    app = new URL(appOrigin)
  } catch {
    return false
  }
  if (url.port !== app.port) return false
  return isLoopbackHost(url.hostname) && isLoopbackHost(app.hostname)
}

/** The origin this request came through, so aliases keep working. */
function originOf(req, appOrigin) {
  const host = typeof req.headers.host === 'string' ? req.headers.host : ''
  if (host !== '' && /^[A-Za-z0-9.:[\]-]+$/.test(host)) {
    const scheme = req.socket !== undefined && req.socket.encrypted === true ? 'https' : 'http'
    try {
      const candidate = new URL(`${scheme}://${host}`)
      if (isLoopbackHost(candidate.hostname) || candidate.origin === appOrigin) return candidate.origin
    } catch {
      // Fall back to the advertised origin.
    }
  }
  return appOrigin
}

/** Accept only a plain HTTP(S) address that is not the application itself. */
function normalizeTarget(raw, appOrigin) {
  if (typeof raw !== 'string' || raw.trim() === '' || raw.length > 2_048) {
    throw httpError(400, 'a valid http(s) address is required')
  }
  let url
  try {
    url = new URL(raw.trim())
  } catch {
    throw httpError(400, 'this is not a valid address')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw httpError(400, 'only http and https addresses can be opened')
  }
  if (url.username !== '' || url.password !== '') {
    throw httpError(400, 'addresses with embedded credentials are refused')
  }
  if (appOrigin !== undefined && isAppAddress(url, appOrigin)) {
    throw httpError(400, 'the application origin cannot be proxied')
  }
  return url
}

/** Detect the document encoding before decoding, so legacy pages stay readable. */
function charsetOf(contentType, head) {
  const header = /charset\s*=\s*"?([\w-]+)/i.exec(contentType ?? '')
  if (header !== null) return header[1].toLowerCase()
  const meta = /<meta[^>]+charset\s*=\s*["']?([\w-]+)/i.exec(head)
  if (meta !== null) return meta[1].toLowerCase()
  const equiv = /<meta[^>]+http-equiv\s*=\s*["']?content-type["']?[^>]*charset\s*=\s*([\w-]+)/i.exec(head)
  if (equiv !== null) return equiv[1].toLowerCase()
  return 'utf-8'
}

function decodeHtml(bytes, charset) {
  try {
    return new TextDecoder(charset, { fatal: false }).decode(bytes)
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  }
}

/** Treat a missing or generic type as HTML when the bytes look like a document. */
function looksLikeHtml(bytes, contentType) {
  if (HTML_TYPE.test(contentType)) return true
  if (contentType !== '' && !/^(text\/plain|application\/octet-stream)\b/i.test(contentType)) return false
  const head = bytes.subarray(0, 512).toString('latin1').trimStart().toLowerCase()
  return head.startsWith('<!doctype html') || head.startsWith('<html')
    || head.includes('<head') || head.includes('<body')
}

function stripHeadMarkup(head) {
  return head
    .replace(/<meta\b[^>]*>/gi, (tag) => (
      /http-equiv\s*=\s*["']?content-security-policy/i.test(tag) ? '' : tag
    ))
    .replace(/<base\b[^>]*>/gi, '')
}

function baseHrefOf(head, canonicalUrl) {
  const tag = /<base\b[^>]*>/i.exec(head)
  if (tag === null) return canonicalUrl
  const href = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag[0])
  const raw = href === null ? '' : (href[1] ?? href[2] ?? href[3] ?? '')
  if (raw === '') return canonicalUrl
  try {
    const resolved = new URL(raw, canonicalUrl)
    if (resolved.protocol === 'http:' || resolved.protocol === 'https:') return resolved.href
  } catch {
    // Keep the real page address.
  }
  return canonicalUrl
}

/**
 * Make the fetched document embeddable and hookable: strip the origin's CSP
 * meta tags and existing `<base>` inside the head only, add `<base href>` so
 * relative subresources still point at the page's own origin, and add the
 * marked bridge script. Returns `null` when the document is already a reader
 * page, which would otherwise stack two bridges in one frame.
 */
export function rewriteHtml(html, canonicalUrl, bridgeUrl) {
  if (html.includes('data-dsh-deepread-bridge')) return null
  let out = html.replace(/^\uFEFF/, '')
  const headOpen = /<head\b[^>]*>/i.exec(out)
  if (headOpen !== null) {
    const headStart = headOpen.index + headOpen[0].length
    const close = out.toLowerCase().indexOf('</head', headStart)
    const headEnd = close === -1 ? out.length : close
    const head = out.slice(headStart, headEnd)
    const base = baseHrefOf(head, canonicalUrl)
    const injected = `<base href="${escapeAttribute(base)}">\n`
      + `<script src="${escapeAttribute(bridgeUrl)}" data-dsh-deepread-bridge="1"`
      + ` data-codelab-url="${escapeAttribute(canonicalUrl)}" defer></script>\n`
    return out.slice(0, headStart) + injected + stripHeadMarkup(head) + out.slice(headEnd)
  }
  const bodyOpen = /<body\b[^>]*>/i.exec(out)
  const injectedAt = bodyOpen !== null ? bodyOpen.index : 0
  const injected = `<head><base href="${escapeAttribute(canonicalUrl)}">`
    + `<script src="${escapeAttribute(bridgeUrl)}" data-dsh-deepread-bridge="1"`
    + ` data-codelab-url="${escapeAttribute(canonicalUrl)}" defer></script></head>`
  return out.slice(0, injectedAt) + injected + out.slice(injectedAt)
}

const ERROR_PAGE_STYLE = `
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
    font: 14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: Canvas; color: CanvasText; padding: 32px; box-sizing: border-box; }
  main { max-width: 520px; }
  h1 { font-size: 17px; font-weight: 600; margin: 0 0 10px; }
  p { margin: 0 0 12px; color: color-mix(in srgb, CanvasText 72%, Canvas); }
  code { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace;
    background: color-mix(in srgb, CanvasText 8%, Canvas); padding: 2px 5px; border-radius: 4px;
    overflow-wrap: anywhere; }
  a { color: LinkText; }
`

function errorPageHtml(heading, detail, url, bridgeUrl) {
  const address = typeof url === 'string' && url !== ''
    ? `<p><code>${escapeText(url)}</code></p>
<p><a href="${escapeAttribute(url)}" data-deepread-external="1">Open this address in the system browser</a></p>`
    : ''
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeText(heading)}</title>
<script src="${escapeAttribute(bridgeUrl)}" data-dsh-deepread-bridge="1" data-codelab-url="${escapeAttribute(url ?? '')}" defer></script>
<style>${ERROR_PAGE_STYLE}</style>
</head><body><main>
<h1>${escapeText(heading)}</h1>
<p>${escapeText(detail)}</p>
${address}
</main></body></html>`
}

/**
 * Injected into every proxied page. The frame has an opaque origin, so it
 * cannot touch the application; it talks to the reader with `postMessage` only.
 */
const BRIDGE = String.raw`(() => {
  const script = document.currentScript;
  const canonical = script && script.dataset ? script.dataset.codelabUrl || '' : '';
  const post = (message) => {
    try { window.parent.postMessage(Object.assign({ __dshDeepread: 1 }, message), '*'); } catch (_) {}
  };
  let lastText = '';
  let lastRect = '';
  let timer = 0;
  let scrolling = 0;
  const selectionOf = () => {
    const selection = document.getSelection();
    return selection === null || selection.rangeCount === 0 ? null : selection;
  };
  const textOf = (selection) => {
    if (selection === null) return '';
    return selection.toString().replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').trim();
  };
  const rectOf = (selection) => {
    if (selection === null || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    const rect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();
    if (rect === undefined || (rect.width === 0 && rect.height === 0)) return null;
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
  };
  const rectKey = (rect) => rect === null ? ''
    : [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)].join(',');
  const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });
  const report = (force) => {
    const selection = selectionOf();
    const text = textOf(selection);
    const rect = rectOf(selection);
    const key = rectKey(rect);
    if (force !== true && text === lastText && key === lastRect) return;
    lastText = text;
    lastRect = key;
    post({ kind: 'selection', text, rect, viewport: viewport() });
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(report, 120);
  };
  document.addEventListener('selectionchange', schedule, true);
  document.addEventListener('mouseup', () => { clearTimeout(timer); timer = setTimeout(() => report(true), 0); }, true);
  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') { post({ kind: 'escape' }); return; }
    if (event.shiftKey || event.key === 'ArrowLeft' || event.key === 'ArrowRight') schedule();
  }, true);

  const address = (anchor) => {
    const raw = anchor.getAttribute('href') || '';
    if (raw.startsWith('#') || raw.startsWith('javascript:') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return null;
    try {
      const resolved = new URL(anchor.href, document.baseURI);
      if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
      return resolved.href;
    } catch (_) { return null; }
  };
  document.addEventListener('click', (event) => {
    const node = event.target;
    if (node === null || typeof node.closest !== 'function') return;
    const anchor = node.closest('a[href]');
    if (anchor === null) return;
    if (anchor.hasAttribute('data-deepread-external')) {
      event.preventDefault();
      post({ kind: 'external', url: anchor.href });
      return;
    }
    const target = address(anchor);
    if (target === null) return;
    event.preventDefault();
    if (event.metaKey || event.ctrlKey || anchor.target === '_blank') post({ kind: 'external', url: target });
    else post({ kind: 'navigate', url: target });
  }, true);
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form === null || typeof form.getAttribute !== 'function') return;
    event.preventDefault();
    try {
      const action = new URL(form.getAttribute('action') || document.baseURI, document.baseURI);
      if ((form.getAttribute('method') || 'get').toLowerCase() !== 'get') {
        post({ kind: 'external', url: action.href });
        return;
      }
      new URLSearchParams(new FormData(form)).forEach((value, key) => action.searchParams.append(key, String(value)));
      post({ kind: 'navigate', url: action.href });
    } catch (_) {}
  }, true);

  const announce = () => post({ kind: 'ready', title: String(document.title || ''), url: canonical || document.baseURI });
  window.addEventListener('load', announce);
  if (document.readyState === 'complete') announce();
  setTimeout(announce, 1200);
  window.addEventListener('scroll', () => {
    if (lastText === '' || scrolling !== 0) return;
    scrolling = setTimeout(() => {
      scrolling = 0;
      const rect = rectOf(selectionOf());
      lastRect = rectKey(rect);
      post({ kind: 'selection', text: lastText, rect, viewport: viewport() });
    }, 120);
  }, { passive: true });
})()`

async function readCapped(response) {
  const declared = Number(response.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > MAX_PAGE_BYTES) {
    throw httpError(413, 'this page is larger than the reader limit')
  }
  const body = response.body
  if (body === null) return Buffer.alloc(0)
  const reader = body.getReader()
  const chunks = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (value === undefined) continue
      size += value.byteLength
      if (size > MAX_PAGE_BYTES) {
        await reader.cancel().catch(() => {})
        throw httpError(413, 'this page is larger than the reader limit')
      }
      chunks.push(Buffer.from(value))
    }
  } finally {
    try {
      reader.releaseLock()
    } catch {
      // The stream may already be closed.
    }
  }
  return Buffer.concat(chunks, size)
}

async function handlePage(req, res, requestUrl, appOrigin) {
  const bridgeUrl = `${originOf(req, appOrigin)}${ROUTE}/bridge.js`
  const target = normalizeTarget(requestUrl.searchParams.get('url'), appOrigin)
  let response
  try {
    response = await fetch(target.href, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'upgrade-insecure-requests': '1',
      },
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    sendHtml(res, 502, errorPageHtml(
      'This page could not be loaded',
      `The reader could not reach it (${reason}). Check the address or the network, or open it in the system browser.`,
      target.href,
      bridgeUrl,
    ))
    return
  }

  const finalUrl = response.url === '' ? target.href : response.url
  let settled
  try {
    settled = new URL(finalUrl)
  } catch {
    settled = target
  }
  if (isAppAddress(settled, appOrigin)) {
    sendHtml(res, 502, errorPageHtml(
      'This page redirects into the application',
      'The reader refuses to fetch the application itself through its proxy.',
      '',
      bridgeUrl,
    ))
    return
  }

  const contentType = response.headers.get('content-type') ?? ''
  let bytes
  try {
    bytes = await readCapped(response)
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 502
    sendHtml(res, status, errorPageHtml(
      'This page could not be shown here',
      error?.message ?? 'The reader stopped before the page could be shown.',
      finalUrl,
      bridgeUrl,
    ))
    return
  }

  if (response.status === 204 || response.status === 205) {
    const empty = rewriteHtml('<!doctype html><html><head></head><body></body></html>', finalUrl, bridgeUrl)
    sendHtml(res, 200, empty ?? '<!doctype html><html><head></head><body></body></html>')
    return
  }
  if (!response.ok) {
    const status = response.status === 304 ? 502 : response.status
    sendHtml(res, status, errorPageHtml(
      `The page answered ${response.status}`,
      'The origin refused this request. It may need a signed-in browser session, or it may block automated reading. The system browser can open it directly.',
      finalUrl,
      bridgeUrl,
    ))
    return
  }
  if (!looksLikeHtml(bytes, contentType)) {
    const type = /^text\//i.test(contentType)
      ? contentType
      : (contentType.split(';')[0].trim() || 'application/octet-stream')
    sendRelay(res, response.status, type, bytes)
    return
  }
  const head = bytes.subarray(0, 4096).toString('latin1')
  const html = decodeHtml(bytes, charsetOf(contentType, head))
  const rewritten = rewriteHtml(html, finalUrl, bridgeUrl)
  if (rewritten === null) {
    sendHtml(res, 502, errorPageHtml(
      'This page is already a reader page',
      'The same document was requested through the reader again, so it was refused to avoid stacking two readers in one frame.',
      '',
      bridgeUrl,
    ))
    return
  }
  sendHtml(res, 200, rewritten)
}

/** Decode only the entities Poppler emits in text content. */
function decodeXml(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos);/g, (match, entity) => {
    if (entity === 'amp') return '&'
    if (entity === 'lt') return '<'
    if (entity === 'gt') return '>'
    if (entity === 'quot') return '"'
    if (entity === 'apos') return "'"
    const hex = entity[1] === 'x' || entity[1] === 'X'
    const code = Number.parseInt(hex ? entity.slice(2) : entity.slice(1), hex ? 16 : 10)
    return Number.isFinite(code) ? String.fromCodePoint(code) : match
  })
}

/**
 * Parse `pdftotext -bbox` output into page records.
 * Word boxes remain in PDF points; the browser converts to percentages.
 */
export function parseBbox(xml) {
  const pages = []
  const pagePattern = /<page\b([^>]*)>([\s\S]*?)<\/page>/g
  const number = (attrs, name, fallback) => {
    const match = new RegExp(`${name}="([^"]+)"`).exec(attrs)
    const value = match === null ? Number.NaN : Number(match[1])
    return Number.isFinite(value) && value > 0 ? value : fallback
  }
  for (let pageMatch = pagePattern.exec(xml); pageMatch !== null; pageMatch = pagePattern.exec(xml)) {
    const attrs = pageMatch[1]
    const width = number(attrs, 'width', 612)
    const height = number(attrs, 'height', 792)
    const words = []
    const wordPattern = /<word\b([^>]*)>([\s\S]*?)<\/word>/g
    for (let match = wordPattern.exec(pageMatch[2]); match !== null; match = wordPattern.exec(pageMatch[2])) {
      const w = match[1]
      const x0 = number(w, 'xMin', 0)
      const y0 = number(w, 'yMin', 0)
      const x1 = number(w, 'xMax', x0)
      const y1 = number(w, 'yMax', y0)
      const text = decodeXml(match[2]).replace(/\s+/g, ' ').trim()
      if (text !== '' && x1 > x0 && y1 > y0) words.push([x0, y0, x1, y1, text])
    }
    pages.push({
      width,
      height,
      words,
      text: words.map((word) => word[4]).join(' '),
    })
  }
  return pages
}

function parseInfo(stdout) {
  const read = (name) => {
    const match = new RegExp(`^${name}:\\s*(.*)$`, 'm').exec(stdout)
    return match === null ? '' : match[1].trim()
  }
  const pages = Number(read('Pages'))
  return {
    pages: Number.isInteger(pages) && pages > 0 ? pages : 0,
    title: read('Title'),
    encrypted: read('Encrypted').toLowerCase() === 'yes',
    size: read('Page size'),
  }
}

function cleanName(value) {
  if (typeof value !== 'string') return 'document.pdf'
  let name = value
  try {
    name = decodeURIComponent(value)
  } catch {
    // Keep the raw header when it is not percent-encoded.
  }
  const cleaned = name
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\\/]/g, ' ')
    .trim()
  return cleaned === '' ? 'document.pdf' : cleaned.slice(0, 160)
}

function snippetOf(text, at, length) {
  const start = Math.max(0, at - 70)
  const end = Math.min(text.length, at + length + 90)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ')}${end < text.length ? '…' : ''}`
}

export function apply(ctx) {
  const root = rootDir()
  const docs = join(root, 'docs')
  const texts = join(root, 'text')
  const pages = join(root, 'pages')
  const temp = join(root, 'tmp')

  /** Parsed document text, kept hot while a reader is open. */
  const textCache = new Map()
  /** Rendered page bytes, bounded so a long read does not grow without limit. */
  const imageCache = new Map()
  /** In-flight page renders, so two scroll events share one Poppler run. */
  const renders = new Map()
  /** Document metadata, including the original display name. */
  const metaCache = new Map()
  /** Extracted bookmark trees, bounded like the other document caches. */
  const outlineCache = new Map()
  let outlineScriptReady
  /** Reading positions, one per document, persisted across browser origins. */
  const positionsFile = join(root, 'positions.json')
  const positions = new Map()
  let positionsReady
  let positionWrite = Promise.resolve()
  const normalizePosition = (raw) => {
    if (raw === null || typeof raw !== 'object') return undefined
    const page = Number(raw.page)
    const ratio = Number(raw.ratio)
    const zoom = Number(raw.zoom)
    if (!Number.isInteger(page) || page < 1 || page > 1_000_000) return undefined
    if (!Number.isFinite(ratio) || ratio < 0 || ratio > 1) return undefined
    if (!Number.isFinite(zoom) || zoom < 0.5 || zoom > 2.5) return undefined
    return {
      page,
      ratio,
      zoom,
      at: Number.isFinite(raw.at) ? Math.floor(raw.at) : Date.now(),
    }
  }
  async function loadPositions() {
    if (positionsReady !== undefined) return positionsReady
    positionsReady = (async () => {
      await dirsReady
      try {
        const parsed = JSON.parse(await readFile(positionsFile, 'utf8'))
        const source = parsed !== null && typeof parsed === 'object' && parsed.positions !== null && typeof parsed.positions === 'object'
          ? parsed.positions
          : {}
        for (const [id, raw] of Object.entries(source)) {
          if (!DOC_ID.test(id)) continue
          const position = normalizePosition(raw)
          if (position !== undefined) positions.set(id, position)
        }
      } catch (error) {
        if (error?.code !== 'ENOENT') ctx.logger?.warn?.(error)
      }
    })()
    return positionsReady
  }
  async function savePosition(id, position) {
    await loadPositions()
    positions.set(id, position)
    while (positions.size > 1000) positions.delete(positions.keys().next().value)
    positionWrite = positionWrite.then(async () => {
      await dirsReady
      const temporary = join(temp, `positions-${process.pid}-${Date.now()}.json`)
      await writeFile(temporary, JSON.stringify({ version: 1, positions: Object.fromEntries(positions) }), 'utf8')
      await rename(temporary, positionsFile)
    }).catch((error) => {
      ctx.logger?.warn?.(error)
    })
    return positionWrite
  }

  const dirsReady = mkdir(docs, { recursive: true })
    .then(() => mkdir(texts, { recursive: true }))
    .then(() => mkdir(pages, { recursive: true }))
    .then(() => mkdir(temp, { recursive: true }))

  const paths = (id) => ({
    pdf: join(docs, `${id}.pdf`),
    text: join(texts, `${id}.json`),
    meta: join(texts, `${id}.meta.json`),
    outline: join(texts, `${id}.outline.json`),
    pageDir: join(pages, id),
  })

  async function loadText(id) {
    const hit = textCache.get(id)
    if (hit !== undefined) return hit
    await dirsReady
    const parsed = JSON.parse(await readFile(paths(id).text, 'utf8'))
    if (textCache.size >= 4) textCache.delete(textCache.keys().next().value)
    textCache.set(id, parsed)
    return parsed
  }

  async function loadMeta(id) {
    const hit = metaCache.get(id)
    if (hit !== undefined) return hit
    await dirsReady
    const meta = JSON.parse(await readFile(paths(id).meta, 'utf8'))
    if (metaCache.size >= 16) metaCache.delete(metaCache.keys().next().value)
    metaCache.set(id, meta)
    return meta
  }

  async function receivePdf(req) {
    await dirsReady
    const tempPath = join(temp, `${randomUUID()}.pdf`)
    const hash = createHash('sha256')
    let size = 0
    const output = createWriteStream(tempPath, { flags: 'wx' })
    try {
      for await (const chunk of req) {
        size += chunk.length
        if (size > MAX_PDF_BYTES) throw httpError(413, `PDF is larger than ${Math.round(MAX_PDF_BYTES / 1024 / 1024)} MB`)
        hash.update(chunk)
        if (!output.write(chunk)) await once(output, 'drain')
      }
      output.end()
      await finished(output)
      const handle = await open(tempPath, 'r')
      try {
        const head = Buffer.alloc(5)
        await handle.read(head, 0, 5, 0)
        if (head.toString('latin1') !== '%PDF-') throw httpError(415, 'the uploaded file is not a PDF')
      } finally {
        await handle.close()
      }
      return { tempPath, id: hash.digest('hex').slice(0, 24), size }
    } catch (error) {
      output.destroy()
      await rm(tempPath, { force: true }).catch(() => {})
      throw error
    }
  }

  async function analyze(id, name) {
    await dirsReady
    const { pdf, text, meta } = paths(id)
    const info = await runTool('pdfinfo', [pdf], { timeout: 20_000, maxBuffer: 4 * 1024 * 1024 })
    const parsed = parseInfo(info.stdout)
    if (parsed.encrypted) throw httpError(422, 'password-protected PDFs are not supported')
    if (parsed.pages === 0) throw httpError(422, 'this PDF has no readable pages')

    let documentPages = []
    try {
      const bbox = await runTool('pdftotext', ['-bbox', '-enc', 'UTF-8', pdf, '-'], {
        timeout: 120_000,
        maxBuffer: MAX_TEXT_OUTPUT,
      })
      documentPages = parseBbox(bbox.stdout)
    } catch (error) {
      // A scanned PDF has no text layer, but its pages still render.
      if (error?.code !== 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') ctx.logger?.warn?.(error)
    }

    if (documentPages.length === 0) {
      const size = /^(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/.exec(parsed.size)
      const width = size === null ? 612 : Number(size[1])
      const height = size === null ? 792 : Number(size[2])
      documentPages = Array.from({ length: parsed.pages }, () => ({
        width: Number.isFinite(width) && width > 0 ? width : 612,
        height: Number.isFinite(height) && height > 0 ? height : 792,
        words: [],
        text: '',
      }))
    }
    // pdfinfo is authoritative for the page count; empty trailing pages can be
    // omitted by pdftotext for image-only documents.
    while (documentPages.length < parsed.pages) {
      const last = documentPages[documentPages.length - 1]
      documentPages.push({ width: last?.width ?? 612, height: last?.height ?? 792, words: [], text: '' })
    }

    const metaValue = {
      id,
      name,
      title: parsed.title || name,
      pages: parsed.pages,
    }
    await writeFile(text, JSON.stringify(documentPages), 'utf8')
    await writeFile(meta, JSON.stringify(metaValue), 'utf8')
    textCache.set(id, documentPages)
    metaCache.set(id, metaValue)
    return { meta: metaValue, documentPages }
  }

  function documentPayload(meta, documentPages) {
    return {
      id: meta.id,
      name: meta.name,
      title: meta.title,
      pages: meta.pages,
      texts: documentPages.map((page) => ({
        width: Math.round(page.width * 100) / 100,
        height: Math.round(page.height * 100) / 100,
        text: page.text,
      })),
    }
  }

  async function renderPage(id, pageNumber) {
    const key = `${id}:${pageNumber}`
    const cached = imageCache.get(key)
    if (cached !== undefined) return cached
    const pending = renders.get(key)
    if (pending !== undefined) return pending
    const work = (async () => {
      await dirsReady
      const target = paths(id)
      const prefix = join(target.pageDir, String(pageNumber))
      const file = `${prefix}.png`
      try {
        const present = await stat(file)
        if (present.size > 0) {
          const bytes = await readFile(file)
          rememberImage(key, bytes)
          return bytes
        }
      } catch {
        // Render below.
      }
      await mkdir(target.pageDir, { recursive: true })
      const temporary = join(temp, `page-${id}-${pageNumber}-${randomUUID()}`)
      await runTool('pdftoppm', [
        '-png',
        '-r',
        String(PAGE_DPI),
        '-f',
        String(pageNumber),
        '-l',
        String(pageNumber),
        '-singlefile',
        target.pdf,
        temporary,
      ], { timeout: 120_000, maxBuffer: 4 * 1024 * 1024 })
      await rename(`${temporary}.png`, file)
      const bytes = await readFile(file)
      rememberImage(key, bytes)
      return bytes
    })()
    renders.set(key, work)
    try {
      return await work
    } finally {
      renders.delete(key)
    }
  }

  function rememberImage(key, bytes) {
    if (imageCache.size >= IMAGE_CACHE_LIMIT) imageCache.delete(imageCache.keys().next().value)
    imageCache.set(key, bytes)
  }

  async function ensureOutlineScript() {
    if (outlineScriptReady !== undefined) return outlineScriptReady
    outlineScriptReady = (async () => {
      await dirsReady
      await writeFile(join(texts, 'outline.jxa'), OUTLINE_SCRIPT, 'utf8')
    })()
    return outlineScriptReady
  }

  /**
   * Read PDF bookmarks with PDFKit. Only macOS ships the JavaScript bridge
   * and PDFKit, so elsewhere this returns an empty list rather than failing
   * the document open.
   */
  async function extractOutline(id) {
    await ensureOutlineScript()
    let result
    try {
      result = await runTool('osascript', [
        '-l', 'JavaScript',
        join(texts, 'outline.jxa'),
        paths(id).pdf,
      ], { timeout: 30_000, maxBuffer: 4 * 1024 * 1024 })
    } catch (error) {
      if (error?.code === 'ENOENT') return { outline: [], error: 'PDF outlines require macOS PDFKit' }
      throw error
    }
    let parsed = null
    try {
      parsed = JSON.parse(result.stdout.trim())
    } catch {
      return { outline: [], error: 'the outline reader returned invalid output' }
    }
    if (!Array.isArray(parsed?.outline)) {
      return { outline: [], error: typeof parsed?.error === 'string' ? parsed.error : 'no outline' }
    }
    const outline = []
    for (const raw of parsed.outline) {
      if (raw === null || typeof raw !== 'object') continue
      const title = typeof raw.title === 'string' ? raw.title.replace(/\s+/g, ' ').trim().slice(0, 300) : ''
      if (title === '') continue
      const page = Number.isInteger(raw.page) && raw.page > 0 ? Math.min(raw.page, 1_000_000) : 0
      const depth = Number.isInteger(raw.depth) ? Math.max(0, Math.min(raw.depth, 12)) : 0
      outline.push({ title, page, depth })
      if (outline.length >= 5000) break
    }
    return { outline, error: undefined }
  }

  async function loadOutline(id) {
    const hit = outlineCache.get(id)
    if (hit !== undefined) return hit
    await dirsReady
    try {
      const rows = JSON.parse(await readFile(paths(id).outline, 'utf8'))
      const value = { outline: Array.isArray(rows) ? rows : [] }
      if (outlineCache.size >= 8) outlineCache.delete(outlineCache.keys().next().value)
      outlineCache.set(id, value)
      return value
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    let value
    try {
      value = await extractOutline(id)
    } catch (error) {
      ctx.logger?.warn?.(error)
      return { outline: [], error: error instanceof Error ? error.message : 'outline extraction failed' }
    }
    if (value.error !== undefined) return value
    await writeFile(paths(id).outline, JSON.stringify(value.outline), 'utf8')
    if (outlineCache.size >= 8) outlineCache.delete(outlineCache.keys().next().value)
    outlineCache.set(id, value)
    return value
  }

  async function searchDocument(id, query) {
    const documentPages = await loadText(id)
    const needle = query.replace(/\s+/g, ' ').trim().toLowerCase()
    if (needle === '') return { query, total: 0, pages: [] }
    const results = []
    let total = 0
    for (let index = 0; index < documentPages.length; index += 1) {
      const page = documentPages[index]
      const haystack = page.text.toLowerCase()
      let at = 0
      let count = 0
      let first = -1
      while (count < 500) {
        const found = haystack.indexOf(needle, at)
        if (found === -1) break
        count += 1
        if (first === -1) first = found
        at = found + Math.max(1, needle.length)
      }
      if (count > 0) {
        total += count
        results.push({
          page: index + 1,
          count,
          snippet: snippetOf(page.text, first, needle.length),
        })
      }
    }
    return { query, total, pages: results.slice(0, 400) }
  }

  async function handleAsk(body) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      throw httpError(400, 'request body must be a JSON object')
    }
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
    const selection = typeof body.text === 'string' ? body.text : ''
    const question = plainLine(body.question, MAX_QUESTION + 1)
    const web = body.source === 'web'
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(sessionId)) throw httpError(400, 'invalid session id')
    if (selection.trim() === '') throw httpError(400, 'selection is empty')
    if (selection.length > MAX_SELECTION) throw httpError(413, 'selection is too long')
    if (question.length > MAX_QUESTION) throw httpError(413, 'question is too long')
    const agent = ctx.agents.get(sessionId)
    if (agent === undefined) throw httpError(409, 'this session is not live; open it once before asking')

    // Quote the passage line by line, and keep a bare CR from escaping the quote.
    const excerpt = selection.replace(/\r\n?/g, '\n')
    const quote = `> ${excerpt.replace(/\n/g, '\n> ')}`
    let instruction
    let message
    if (web) {
      const title = plainLine(body.title, 200)
      let source = ''
      try {
        source = ` (${normalizeTarget(body.url).href})`
      } catch {
        source = ''
      }
      const where = title === '' ? 'a web page' : `the page “${title}”`
      instruction = question === ''
        ? 'Explain this passage. Start with the gist, then name the key concepts or anything questionable.'
        : question
      message = `I am reading ${where}${source} and selected this passage:\n\n${quote}\n\n${instruction}`
    } else {
      instruction = question === '' ? '请解释这段内容，先概括要点，再指出关键概念或可疑之处。' : question
      message = `我最近在读一份 PDF，选中了下面这段：\n\n${quote}\n\n${instruction}`
    }
    agent.followup({
      id: randomUUID(),
      role: 'user',
      content: [{ type: 'text', text: message }],
      source: { kind: 'user' },
    })
    return { ok: true, agent: agent.id, queued: agent.status === 'running' }
  }

  async function handleWebSearch(body) {
    const query = typeof body.query === 'string' ? body.query.trim().slice(0, 500) : ''
    if (query === '') throw httpError(400, 'query is empty')
    try {
      const result = await ctx.web.search({ query, maxResults: 8 }, AbortSignal.timeout(20_000))
      return {
        query,
        content: typeof result.content === 'string' ? result.content.slice(0, 4000) : '',
        sources: (result.sources ?? []).map((source) => ({
          url: source.url,
          title: typeof source.title === 'string' ? source.title : source.url,
          snippet: typeof source.snippet === 'string' ? source.snippet : '',
          publishedAt: source.publishedAt,
        })),
        truncated: result.truncated === true,
      }
    } catch (error) {
      throw httpError(502, error instanceof Error ? error.message : 'web search is unavailable')
    }
  }

  async function handleOpenUrl(body, appOrigin) {
    const target = normalizeTarget(body.url, appOrigin)
    const now = Date.now()
    if (now - openGate.at < OPEN_INTERVAL_MS) {
      throw httpError(429, 'opening too quickly; wait a moment and try again')
    }
    openGate.at = now
    const platform = process.platform
    const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'rundll32' : 'xdg-open'
    const args = platform === 'win32' ? ['url.dll,FileProtocolHandler', target.href] : [target.href]
    try {
      await exec(command, args, { timeout: 10_000 })
    } catch (error) {
      throw httpError(502, `could not open the system browser: ${error instanceof Error ? error.message : String(error)}`)
    }
    return { ok: true, url: target.href }
  }

  async function handle(req, res) {
    const origin = ctx.webServer.getOrigin()
    const url = new URL(req.url ?? '/', origin)
    const path = url.pathname
    if (!path.startsWith(ROUTE)) throw httpError(404, 'not found')

    const seenOrigin = req.headers.origin
    if (typeof seenOrigin === 'string') {
      let allowed = seenOrigin === origin
      if (!allowed) {
        try {
          const header = new URL(seenOrigin)
          allowed = isLoopbackHost(header.hostname) && header.port === new URL(origin).port
        } catch {
          allowed = false
        }
      }
      if (!allowed) throw httpError(403, 'cross-origin request refused')
    }

    const isWrite = req.method === 'POST'
    if (isWrite && req.headers['x-dsh-deepread'] !== '1') {
      throw httpError(403, 'missing deepread request header')
    }

    if (req.method === 'GET' && path === `${ROUTE}/bridge.js`) {
      const body = Buffer.from(BRIDGE, 'utf8')
      res.writeHead(200, {
        'content-type': 'application/javascript; charset=utf-8',
        'content-length': body.length,
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      })
      res.end(body)
      return
    }
    if (req.method === 'GET' && path === `${ROUTE}/page`) {
      await handlePage(req, res, url, origin)
      return
    }

    if (isWrite && path === `${ROUTE}/open`) {
      // The upload is the raw PDF body, not JSON, so it is read before the
      // JSON branch below can consume it.
      const received = await receivePdf(req)
      await dirsReady
      const finalPath = paths(received.id).pdf
      let exists = false
      try {
        const present = await stat(finalPath)
        exists = present.size > 0
      } catch {}
      if (!exists) await rename(received.tempPath, finalPath)
      else await rm(received.tempPath, { force: true }).catch(() => {})
      const name = cleanName(req.headers['x-deepread-filename'])
      const analyzed = await analyze(received.id, name)
      sendJson(res, 200, documentPayload(analyzed.meta, analyzed.documentPages))
      return
    }

    if (isWrite) {
      const body = await readJson(req)
      if (path === `${ROUTE}/websearch`) {
        sendJson(res, 200, await handleWebSearch(body))
        return
      }
      if (path === `${ROUTE}/ask`) {
        sendJson(res, 200, await handleAsk(body))
        return
      }
      if (path === `${ROUTE}/open-page`) {
        sendJson(res, 200, await handleOpenUrl(body, origin))
        return
      }
      if (path === `${ROUTE}/position`) {
        const id = typeof body.docId === 'string' ? body.docId : ''
        if (!DOC_ID.test(id)) throw httpError(400, 'invalid document id')
        try {
          await loadMeta(id)
        } catch (error) {
          if (error?.code === 'ENOENT') throw httpError(404, 'document not found')
          throw error
        }
        const position = normalizePosition(body)
        if (position === undefined) throw httpError(400, 'invalid reading position')
        await savePosition(id, position)
        sendJson(res, 200, { ok: true })
        return
      }
      throw httpError(404, 'not found')
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      const docMatch = new RegExp(`^${ROUTE}/doc/([a-f0-9]{24})$`).exec(path)
      if (docMatch !== null) {
        const id = docMatch[1]
        try {
          const meta = await loadMeta(id)
          const documentPages = await loadText(id)
          sendJson(res, 200, documentPayload(meta, documentPages))
        } catch (error) {
          if (error?.code === 'ENOENT') throw httpError(404, 'document not found')
          throw error
        }
        return
      }
      const textMatch = new RegExp(`^${ROUTE}/text/([a-f0-9]{24})/(\\d{1,6})$`).exec(path)
      if (textMatch !== null) {
        const documentPages = await loadText(textMatch[1])
        const page = documentPages[Number(textMatch[2]) - 1]
        if (page === undefined) throw httpError(404, 'page not found')
        sendJson(res, 200, { width: page.width, height: page.height, words: page.words })
        return
      }
      const pageMatch = new RegExp(`^${ROUTE}/page/([a-f0-9]{24})/(\\d{1,6})$`).exec(path)
      if (pageMatch !== null) {
        const id = pageMatch[1]
        const number = Number(pageMatch[2])
        try {
          const meta = await loadMeta(id)
          if (number < 1 || number > meta.pages) throw httpError(404, 'page not found')
        } catch (error) {
          if (error?.code === 'ENOENT') throw httpError(404, 'document not found')
          throw error
        }
        sendPng(res, await renderPage(id, number))
        return
      }
      const positionMatch = new RegExp(`^${ROUTE}/position/([a-f0-9]{24})$`).exec(path)
      if (positionMatch !== null) {
        const id = positionMatch[1]
        try {
          await loadMeta(id)
        } catch (error) {
          if (error?.code === 'ENOENT') throw httpError(404, 'document not found')
          throw error
        }
        await loadPositions()
        sendJson(res, 200, { position: positions.get(id) ?? null })
        return
      }
      const outlineMatch = new RegExp(`^${ROUTE}/outline/([a-f0-9]{24})$`).exec(path)
      if (outlineMatch !== null) {
        const id = outlineMatch[1]
        try {
          await loadMeta(id)
        } catch (error) {
          if (error?.code === 'ENOENT') throw httpError(404, 'document not found')
          throw error
        }
        sendJson(res, 200, await loadOutline(id))
        return
      }
      const searchMatch = new RegExp(`^${ROUTE}/search/([a-f0-9]{24})$`).exec(path)
      if (searchMatch !== null) {
        const query = url.searchParams.get('q') ?? ''
        if (query.trim() === '') {
          sendJson(res, 200, { query, total: 0, pages: [] })
          return
        }
        sendJson(res, 200, await searchDocument(searchMatch[1], query))
        return
      }
    }

    throw httpError(404, 'not found')
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE,
    handler: (req, res) => {
      handle(req, res).catch((error) => {
        const status = Number.isInteger(error?.status) ? error.status : 500
        const message = error?.status ? error.message : 'DeepRead request failed'
        if (!error?.status) ctx.logger?.warn?.(error)
        if (res.headersSent) {
          res.destroy()
          return
        }
        const path = new URL(req.url ?? '/', 'http://placeholder').pathname
        if (req.method === 'GET' && path === `${ROUTE}/page`) {
          sendHtml(res, status, errorPageHtml(
            'This page could not be opened',
            message,
            '',
            `${originOf(req, ctx.webServer.getOrigin())}${ROUTE}/bridge.js`,
          ))
          return
        }
        sendJson(res, status, { error: message })
      })
    },
  }), 'deepread: HTTP route')
}