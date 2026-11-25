import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parseBbox, rewriteHtml, normalizeTarget, plainLine, isBlockedIp, clampDpi, createLimiter } from '../index.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

const BBOX = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"><body><doc>
<page width="612.000000" height="792.000000">
<word xMin="72.000000" yMin="100.000000" xMax="120.000000" yMax="112.000000">Hello</word>
<word xMin="126.000000" yMin="100.000000" xMax="174.000000" yMax="112.000000">W&#246;rld &amp; Co</word>
</page>
<page width="612.000000" height="792.000000">
<word xMin="72.000000" yMin="90.000000" xMax="90.000000" yMax="102.000000">Two</word>
</page>
</doc></body></html>`

test('parseBbox keeps pages, word boxes and page text', () => {
  const pages = parseBbox(BBOX)
  assert.equal(pages.length, 2)
  assert.equal(pages[0].width, 612)
  assert.equal(pages[0].height, 792)
  assert.deepEqual(pages[0].words[0], [72, 100, 120, 112, 'Hello'])
  assert.equal(pages[0].words[1][4], 'Wörld & Co')
  assert.equal(pages[0].text, 'Hello Wörld & Co')
  assert.equal(pages[1].text, 'Two')
})

test('parseBbox drops words with no area', () => {
  const pages = parseBbox('<page width="10" height="10"><word xMin="5" yMin="5" xMax="5" yMax="9">bad</word></page>')
  assert.equal(pages[0].words.length, 0)
  assert.equal(pages[0].text, '')
})

test('rewriteHtml injects the base and the bridge', () => {
  const source = '<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="x"><title>t</title></head><body><p>x</p></body></html>'
  const out = rewriteHtml(source, 'https://example.com/page', 'http://app/api/bridge.js')
  assert.match(out, /<base href="https:\/\/example\.com\/page">/)
  assert.match(out, /data-dsh-deepread-bridge="1"/)
  assert.match(out, /src="http:\/\/app\/api\/bridge\.js"/)
  assert.doesNotMatch(out, /http-equiv="Content-Security-Policy"/)
})

test('rewriteHtml keeps the page\'s own base for subresources', () => {
  const source = '<html><head><base href="https://cdn.example.com/assets/"></head><body></body></html>'
  const out = rewriteHtml(source, 'https://example.com/page', 'http://app/b.js')
  assert.match(out, /<base href="https:\/\/cdn\.example\.com\/assets\/">/)
  assert.equal((out.match(/<base /g) ?? []).length, 1)
})

test('rewriteHtml adds a head to fragment-like pages', () => {
  const out = rewriteHtml('<body><p>x</p></body>', 'https://example.com/p', 'http://app/b.js')
  assert.match(out, /^<head><base href="https:\/\/example\.com\/p">/)
})

test('rewriteHtml refuses a document that already carries a bridge', () => {
  assert.equal(rewriteHtml('<html><head><script data-dsh-deepread-bridge="1"></script></head></html>', 'https://e.com', 'http://app/b.js'), null)
})

test('normalizeTarget accepts plain http(s) and rejects the rest', () => {
  assert.equal(normalizeTarget('https://example.com/a?b=1').href, 'https://example.com/a?b=1')
  const rejects = [
    ['', 400],
    ['not a url', 400],
    ['ftp://example.com/file', 400],
    ['http://user:secret@example.com/', 400],
    ['http://127.0.0.1:51340/', 400],
  ]
  for (const [input, status] of rejects) {
    assert.throws(() => normalizeTarget(input, input.startsWith('http://127.') ? 'http://127.0.0.1:51340' : 'http://127.0.0.1:51340'), (error) => error.status === status, input)
  }
})

test('plainLine collapses control characters and truncates', () => {
  assert.equal(plainLine('a\u0000b\tc\n\nd', 100), 'a b c d')
  assert.equal(plainLine('  spaced  ', 10), 'spaced')
  assert.equal(plainLine('abcdef', 3), 'abc')
  assert.equal(plainLine(42, 10), '')
})

test('isBlockedIp separates public from internal ranges', () => {
  const blocked = ['10.0.0.1', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '224.0.0.1', 'fd00::1', 'fe80::1', '::ffff:10.0.0.1']
  for (const address of blocked) assert.equal(isBlockedIp(address), true, address)
  for (const address of ['127.0.0.1', '8.8.8.8', '2606:4700::1111', '::1', '::ffff:8.8.8.8']) {
    assert.equal(isBlockedIp(address), false, address)
  }
})

test('clampDpi keeps renders inside the supported range', () => {
  assert.equal(clampDpi(null), 130)
  assert.equal(clampDpi(60), 96)
  assert.equal(clampDpi(999), 300)
  assert.equal(clampDpi(137), 140)
})

test('the manifest, locales and detail documents agree', async () => {
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  assert.equal(pkg.license, 'MIT')
  assert.match(String(pkg.engines?.dsh ?? ''), /0\.2/)
  assert.equal(pkg.engines?.node, '>=20')
  assert.ok(pkg.files.includes('docs'), 'docs is packaged')
  assert.ok(existsSync(join(root, 'LICENSE')), 'LICENSE exists')
  for (const lang of ['en', 'zh']) {
    const locale = JSON.parse(await readFile(join(root, 'locale', `${lang}.json`), 'utf8'))
    const detail = locale.meta?.detail
    assert.ok(detail, `${lang} declares a detail document`)
    assert.ok(existsSync(join(root, detail)), `${detail} exists`)
    const doc = await readFile(join(root, detail), 'utf8')
    assert.match(doc.trim(), /^!\[[^\]]+\]\(preview\.svg\)$/, `${detail} is one image line`)
    assert.ok(existsSync(join(root, 'docs', 'preview.svg')), 'preview.svg exists')
  }
})

test('createLimiter never runs more than its limit', async () => {
  const run = createLimiter(2)
  let active = 0
  let peak = 0
  await Promise.all(Array.from({ length: 8 }, () => run(async () => {
    active += 1
    peak = Math.max(peak, active)
    await new Promise((resolve) => setTimeout(resolve, 5))
    active -= 1
  })))
  assert.equal(peak, 2)
  assert.equal(active, 0)
})
