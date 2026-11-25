window.__ModuleLoader__.load({
  id: '@pemako/dsh-deepread',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'deepread'
    const API = '/dsh-deepread/api'

    // ---------------------------------------------------------------------
    // Copy. Runtime dictionaries are embedded so the panel never needs a
    // second round-trip just to show its own chrome.
    // ---------------------------------------------------------------------
    const en = {
      'panel.label': 'DeepRead',
      'source.label': 'Document source',
      'source.pdf': 'PDF',
      'source.web': 'Web page',
      'page.address': 'Address of a page to study',
      'page.go': 'Open',
      'page.back': 'Back',
      'page.forward': 'Forward',
      'page.reload': 'Reload',
      'page.external': 'Open in system browser',
      'webfind.placeholder': 'Find in this page',
      'page.reader': 'Reader',
      'page.original': 'Original site',
      'page.readerHint': 'Reader mode proxies the page so it can be embedded and its selections read',
      'page.originalHint': 'Original site mode loads the page unmodified; selections cannot be captured',
      'page.loading': 'Loading',
      'page.untitled': 'Untitled page',
      'page.directNote': 'Original site mode cannot capture selections.',
      'page.switchReader': 'Use Reader',
      'page.zoomOut': 'Zoom out the page',
      'page.zoomIn': 'Zoom in the page',
      'page.zoomReset': 'Reset to 100% (Ctrl or Cmd + wheel also zooms in Reader mode)',
      'page.emptyTitle': 'Read a web page beside the conversation',
      'page.emptyBody': 'Enter an address above. The page stays on the left so you can select a passage and ask the live session about it.',
      'page.emptyHint': 'Reader mode proxies the page so it can be embedded and its selections read.',
      'error.address': 'That is not a valid http(s) address.',
      'error.open': 'Could not open the system browser: {message}',
      'toolbar.open': 'Open PDF',
      'toolbar.replace': 'Replace',
      'toolbar.untitled': 'No PDF open',
      'toolbar.page': 'Page',
      'toolbar.of': '/',
      'toolbar.zoomIn': 'Zoom in',
      'toolbar.zoomOut': 'Zoom out',
      'toolbar.fit': 'Fit width',
      'toolbar.find': 'Find in document',
      'toolbar.previous': 'Previous match',
      'toolbar.next': 'Next match',
      'toolbar.matches': '{count} matches',
      'toolbar.results': 'Matches in this document',
      'toolbar.noMatches': 'No matches',
      'toolbar.reading': 'Reading',
      'empty.title': 'Read a PDF, keep the conversation',
      'empty.body': 'The PDF stays on the left. The live session stays on the right, so you can ask about a page without leaving it.',
      'empty.action': 'Choose a PDF',
      'empty.web': 'Read a web page',
      'empty.hint': 'Text is selectable. Copying a passage offers search and ask.',
      'loading.uploading': 'Uploading and reading “{name}”…',
      'loading.opening': 'Opening PDF…',
      'loading.page': 'Loading page…',
      'error.upload': 'Could not open this PDF: {message}',
      'error.page': 'This page could not be rendered.',
      'error.search': 'Search failed: {message}',
      'error.web': 'Web search failed: {message}',
      'error.ask': 'Could not send to the conversation: {message}',
      'error.noSession': 'Open a session first, then ask about the selection.',
      'error.notPdf': 'Choose a PDF file.',
      'error.mark': 'Could not save the highlight: {message}',
      'selection.count': '{count} characters selected',
      'selection.copy': 'Copy',
      'selection.search': 'Search',
      'selection.ask': 'Ask AI',
      'selection.highlight': 'Highlight',
      'selection.copied': 'Copied',
      'selection.copyFailed': 'Copy failed',
      'selection.asked': 'Sent to the conversation',
      'selection.close': 'Clear selection',
      'web.title': 'Web search',
      'web.placeholder': 'Search the selection or a phrase',
      'web.run': 'Search',
      'web.loading': 'Searching…',
      'web.empty': 'No web results.',
      'web.ask': 'Ask AI instead',
      'chat.title': 'Conversation',
      'chat.live': 'Live session',
      'chat.none': 'No session',
      'chat.emptyTitle': 'No conversation is open',
      'chat.emptyBody': 'Open a session to read and discuss the PDF in the same view. This is the real session, not a copy.',
      'chat.open': 'Open conversation',
      'chat.new': 'New session',
      'chat.restore': 'The PDF is still here when you come back.',
      'chat.follow': 'Follow current session',
      'chat.pick': 'Session',
      'doc.pages': '{count} pages',
      'doc.selected': 'Selected text',
      'doc.loading': 'Parsing',
      'more.open': 'More actions',
      'docs.open': 'Documents',
      'docs.title': 'Recent documents',
      'docs.empty': 'No documents yet. Open a PDF and it shows up here.',
      'docs.remove': 'Remove',
      'docs.confirm': 'Confirm',
      'docs.pages': '{count} pages',
      'error.docOpen': 'Could not open this document: {message}',
      'notes.open': 'Highlights',
      'notes.title': 'Highlights and notes',
      'notes.empty': 'Nothing highlighted yet. Select text in the page, then highlight it.',
      'notes.edit': 'Note',
      'notes.placeholder': 'Write a note for this highlight',
      'notes.save': 'Save',
      'notes.delete': 'Delete',
      'notes.close': 'Close',
      'notes.colour': 'Colour',
      'notes.count': '{count} highlights',
      'notes.jump': 'Go to page {page}',
      'toast.highlighted': 'Highlight saved',
      'toast.markSaved': 'Note saved',
      'toast.sent': 'Sent to the conversation',
      'toast.copied': 'Copied to the clipboard',
      'toast.opened': 'PDF ready',
      'toc.open': 'Contents',
      'toc.title': 'Contents',
      'toc.empty': 'This PDF has no bookmark outline.',
      'toc.noMatch': 'No matching chapters.',
      'toc.loading': 'Reading contents…',
      'toc.error': 'Could not read contents: {message}',
      'toc.filter': 'Filter chapters',
      'toc.count': '{count} entries',
      'toc.expand': 'Expand all',
      'toc.collapse': 'Collapse all',
      'side.mode': 'Right pane layout',
      'side.split': 'Split',
      'side.chat': 'Chat',
      'side.terminal': 'Terminal',
      'side.collapse': 'Collapse the right pane',
      'side.expand': 'Show the right pane',
      'side.collapsed': 'Right pane hidden — the conversation and terminal keep running',
      'term.title': 'Terminal',
      'term.new': 'New terminal',
      'term.emptyTitle': 'Open a session first',
      'term.emptyBody': 'The terminal runs in the session workspace. Open or choose a session above.',
      'term.loading': 'Loading terminal…',
      'term.unavailable': 'Terminal UI is unavailable: {message}',
      'term.shell': 'Session shell',
    }

    const zh = {
      'panel.label': '深读',
      'source.label': '文档来源',
      'source.pdf': 'PDF',
      'source.web': '网页',
      'page.address': '要学习的网页地址',
      'page.go': '打开',
      'page.back': '后退',
      'page.forward': '前进',
      'page.reload': '刷新',
      'page.external': '用系统浏览器打开',
      'webfind.placeholder': '在这个页面里查找',
      'page.reader': '阅读模式',
      'page.original': '原站模式',
      'page.readerHint': '阅读模式经本地代理嵌入网页，才能读取选中内容',
      'page.originalHint': '原站模式原样加载网页，无法获取选中内容',
      'page.loading': '加载中',
      'page.untitled': '无标题页面',
      'page.directNote': '原站模式无法获取选中内容。',
      'page.switchReader': '切回阅读模式',
      'page.zoomOut': '缩小网页',
      'page.zoomIn': '放大网页',
      'page.zoomReset': '恢复 100%（阅读模式下 ⌘/Ctrl + 滚轮也可缩放）',
      'page.emptyTitle': '左边读网页，右边问会话',
      'page.emptyBody': '在上方输入网址。网页留在左边，选中一段就能直接问当前会话。',
      'page.emptyHint': '阅读模式经本地代理嵌入网页，所以才能划词提问。',
      'error.address': '这不是有效的 http(s) 地址。',
      'error.open': '打开系统浏览器失败：{message}',
      'toolbar.open': '打开 PDF',
      'toolbar.replace': '替换',
      'toolbar.untitled': '尚未打开 PDF',
      'toolbar.page': '页码',
      'toolbar.of': '/',
      'toolbar.zoomIn': '放大',
      'toolbar.zoomOut': '缩小',
      'toolbar.fit': '适合宽度',
      'toolbar.find': '在文档中查找',
      'toolbar.previous': '上一个匹配',
      'toolbar.next': '下一个匹配',
      'toolbar.matches': '{count} 处匹配',
      'toolbar.results': '本文档中的匹配',
      'toolbar.noMatches': '没有匹配',
      'toolbar.reading': '正在阅读',
      'empty.title': '读 PDF，也不离开对话',
      'empty.body': 'PDF 占据左半边，当前会话就在右半边。看页面的同时可以直接提问，不用来回切换。',
      'empty.action': '选择 PDF',
      'empty.web': '读一个网页',
      'empty.hint': '文字可选中；复制一段后会出现搜索和提问按钮。',
      'loading.uploading': '正在上传并解析“{name}”…',
      'loading.opening': '正在打开 PDF…',
      'loading.page': '正在加载页面…',
      'error.upload': '无法打开这个 PDF：{message}',
      'error.page': '这一页渲染失败。',
      'error.search': '搜索失败：{message}',
      'error.web': '网页搜索失败：{message}',
      'error.ask': '发送到对话失败：{message}',
      'error.noSession': '请先打开一个会话，再对选中内容提问。',
      'error.notPdf': '请选择 PDF 文件。',
      'selection.count': '已选中 {count} 字',
      'selection.copy': '复制',
      'selection.search': '搜索',
      'selection.ask': '问 AI',
      'selection.highlight': '高亮',
      'selection.copied': '已复制',
      'selection.copyFailed': '复制失败',
      'selection.asked': '已发送到对话',
      'selection.close': '清除选择',
      'web.title': '网页搜索',
      'web.placeholder': '搜索选中内容或短语',
      'web.run': '搜索',
      'web.loading': '正在搜索…',
      'web.empty': '没有网页结果。',
      'web.ask': '改为问 AI',
      'chat.title': '对话',
      'chat.live': '当前会话',
      'chat.none': '未选择会话',
      'chat.emptyTitle': '当前没有打开的会话',
      'chat.emptyBody': '打开一个会话，就能在同一视图里边读 PDF 边讨论。这里是真实会话，不是副本。',
      'chat.open': '打开对话',
      'chat.new': '新建会话',
      'chat.restore': '回来时 PDF 仍会保留。',
      'chat.follow': '跟随当前会话',
      'chat.pick': '会话',
      'doc.pages': '{count} 页',
      'doc.selected': '选中文本',
      'doc.loading': '解析中',
      'more.open': '更多操作',
      'docs.open': '文档',
      'docs.title': '最近的文档',
      'docs.empty': '还没有文档。打开一个 PDF 就会出现在这里。',
      'docs.remove': '删除',
      'docs.confirm': '确认删除',
      'docs.pages': '{count} 页',
      'error.docOpen': '打不开这份文档：{message}',
      'notes.open': '高亮',
      'notes.title': '高亮与笔记',
      'notes.empty': '还没有高亮。在页面上选中文字，点「高亮」即可。',
      'notes.edit': '笔记',
      'notes.placeholder': '给这条高亮写点笔记',
      'notes.save': '保存',
      'notes.delete': '删除',
      'notes.close': '关闭',
      'notes.colour': '颜色',
      'notes.count': '{count} 条高亮',
      'notes.jump': '跳到第 {page} 页',
      'toast.highlighted': '高亮已保存',
      'toast.markSaved': '笔记已保存',
      'toast.sent': '已发送到对话',
      'toast.copied': '已复制到剪贴板',
      'toast.opened': 'PDF 已就绪',
      'toc.open': '目录',
      'toc.title': '目录',
      'toc.empty': '这份 PDF 没有书签目录。',
      'toc.noMatch': '没有匹配的章节。',
      'toc.loading': '正在读取目录…',
      'toc.error': '无法读取目录：{message}',
      'toc.filter': '筛选章节',
      'toc.count': '{count} 条',
      'toc.expand': '全部展开',
      'toc.collapse': '全部收起',
      'side.mode': '右栏布局',
      'side.split': '分栏',
      'side.chat': '对话',
      'side.terminal': '终端',
      'side.collapse': '收起右栏',
      'side.expand': '展开右栏',
      'side.collapsed': '右栏已收起，会话和终端仍在后台运行',
      'term.title': '终端',
      'term.new': '新终端',
      'term.emptyTitle': '终端需要先打开会话',
      'term.emptyBody': '终端运行在会话的工作区里。请在上方打开或选择一个会话。',
      'term.loading': '正在加载终端…',
      'term.unavailable': '终端界面不可用：{message}',
      'term.shell': '会话 Shell',
    }

    function format(t, key, params) {
      const raw = t(key)
      if (params === undefined) return raw
      return raw.replace(/\{(\w+)\}/g, (match, name) => (
        params[name] === undefined ? match : String(params[name])
      ))
    }

    /** A typed address becomes one canonical http(s) URL, or null when invalid. */
    function normalizeAddress(input) {
      const raw = String(input ?? '').trim()
      if (raw === '') return ''
      const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
      const local = /^(localhost|127\.\d+\.\d+\.\d+|\[::1\]|0\.0\.0\.0)(:\d+)?([/?#]|$)/i.test(raw)
      const withScheme = hasScheme ? raw : `${local ? 'http' : 'https'}://${raw}`
      let parsed
      try {
        parsed = new URL(withScheme)
      } catch {
        return null
      }
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
      if (parsed.username !== '' || parsed.password !== '') return null
      return parsed.href
    }

    function apiUrl(path) {
      return `${API}${path}`
    }

    const POSITION_PREFIX = 'dsh.deepread.pos.'

    /**
     * Storage access that never throws. Private windows and full quotas reject
     * reads and writes, and a reader should keep working without them.
     */
    function safeGet(key) {
      try {
        return window.localStorage.getItem(key)
      } catch {
        return null
      }
    }

    function safeSet(key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        // Storage is optional; the in-memory state still works.
      }
    }

    function safeRemove(key) {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Storage is optional.
      }
    }

    function positionKey(id) {
      return `${POSITION_PREFIX}${id}`
    }

    function normalizeStoredPosition(raw) {
      if (raw === null || typeof raw !== 'object') return null
      const page = Number(raw.page)
      const ratio = Number(raw.ratio)
      const zoom = Number(raw.zoom)
      if (!Number.isInteger(page) || page < 1 || page > 1_000_000) return null
      if (!Number.isFinite(ratio) || ratio < 0 || ratio > 1) return null
      if (!Number.isFinite(zoom) || zoom < 0.5 || zoom > 2.5) return null
      return {
        page,
        ratio,
        zoom,
        at: Number.isFinite(raw.at) ? Math.floor(raw.at) : Date.now(),
      }
    }

    function readLocalPosition(id) {
      try {
        const raw = safeGet(positionKey(id))
        if (raw === null) return null
        return normalizeStoredPosition(JSON.parse(raw))
      } catch {
        return null
      }
    }

    function writeLocalPosition(id, position) {
      try {
        safeSet(positionKey(id), JSON.stringify({
          page: position.page,
          ratio: position.ratio,
          zoom: position.zoom,
          at: position.at,
        }))
      } catch {
        // Reading still works when storage is unavailable.
      }
    }

    async function readJsonResponse(response) {
      const body = await response.text()
      let value = null
      if (body !== '') {
        try {
          value = JSON.parse(body)
        } catch {
          value = null
        }
      }
      if (!response.ok) {
        const message = value && typeof value.error === 'string' ? value.error : `HTTP ${response.status}`
        throw new Error(message)
      }
      return value
    }

    async function postJson(path, payload) {
      const response = await fetch(apiUrl(path), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-dsh-deepread': '1',
        },
        body: JSON.stringify(payload),
      })
      return readJsonResponse(response)
    }

    // ---------------------------------------------------------------------
    // Icons. Inline, currentColor, no external assets.
    // ---------------------------------------------------------------------
    function Icon({ size = 16, children, viewBox = '0 0 20 20', style }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox,
        fill: 'none',
        'aria-hidden': true,
        style: { display: 'block', flex: 'none', ...style },
      }, children)
    }

    function BookIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M3.2 4.4c1.6-.5 3.3-.2 4.8.8v10.2c-1.5-1-3.2-1.3-4.8-.8V4.4Z', stroke: 'currentColor', strokeWidth: 1.35, strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M16.8 4.4c-1.6-.5-3.3-.2-4.8.8v10.2c1.5-1 3.2-1.3 4.8-.8V4.4Z', stroke: 'currentColor', strokeWidth: 1.35, strokeLinejoin: 'round' }),
      ])
    }

    function MoreIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('circle', { key: 'a', cx: 4.6, cy: 10, r: 1.4, fill: 'currentColor' }),
        h('circle', { key: 'b', cx: 10, cy: 10, r: 1.4, fill: 'currentColor' }),
        h('circle', { key: 'c', cx: 15.4, cy: 10, r: 1.4, fill: 'currentColor' }),
      ])
    }

    function StackIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M6.2 3.8h8.1L17.8 7v9.2H6.2V3.8Z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M3.4 6.6v9.6h9', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
      ])
    }

    function MarkerIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M4.6 15.4 6 9.9l5.5-5.5a1.5 1.5 0 0 1 2.1 0l2 2a1.5 1.5 0 0 1 0 2.1L10.1 14l-5.5 1.4Z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
      ])
    }

    function OpenIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M3 6.5h4l1.3 1.5h8.7v7.4H3V6.5Z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M3 6.5V4.6h6l1 1.3', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      ])
    }

    function SearchIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('circle', { key: 'a', cx: 8.6, cy: 8.6, r: 4.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', { key: 'b', d: 'm12.3 12.3 4 4', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
      ])
    }

    function CopyIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('rect', { key: 'a', x: 7, y: 7, width: 9, height: 9, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', { key: 'b', d: 'M13 7V5.6c0-.6-.4-1-1-1H5.6c-.6 0-1 .4-1 1v6.4c0 .6.4 1 1 1H7', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
      ])
    }

    function SparkIcon({ size = 16 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M10 3.2 11.4 7 15 8.4 11.4 9.8 10 13.6 8.6 9.8 5 8.4 8.6 7 10 3.2Z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M15.2 13.2 16 15.2l2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z', fill: 'currentColor', opacity: 0.7 }),
      ])
    }

    function ChevronIcon({ size = 14, direction = 'down' }) {
      const rotate = { up: 180, left: 90, right: -90, down: 0 }[direction]
      return h(Icon, { size, style: { transform: `rotate(${rotate}deg)` } }, h('path', {
        d: 'm5 7.5 5 5 5-5',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }))
    }

    function CloseIcon({ size = 14 }) {
      return h(Icon, { size }, h('path', {
        d: 'm5 5 10 10M15 5 5 15',
        stroke: 'currentColor',
        strokeWidth: 1.4,
        strokeLinecap: 'round',
      }))
    }

    function MinusIcon({ size = 14 }) {
      return h(Icon, { size }, h('path', { d: 'M4 10h12', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }))
    }

    function PlusIcon({ size = 14 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M4 10h12', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
        h('path', { key: 'b', d: 'M10 4v12', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
      ])
    }

    function PageIcon({ size = 14 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M5 3.5h6l4 4V16.5H5V3.5Z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M11 3.5v4h4', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
      ])
    }

    function TocIcon({ size = 15 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M4 5.5h12M4 10h8M4 14.5h10', stroke: 'currentColor', strokeWidth: 1.35, strokeLinecap: 'round' }),
        h('path', { key: 'b', d: 'M15.2 12.2 17 14l-1.8 1.8', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      ])
    }

    function TerminalIcon({ size = 15 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M3.5 5.5 7.5 9.5 3.5 13.5', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M9.5 14h7', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
      ])
    }

    function GlobeIcon({ size = 15 }) {
      return h(Icon, { size }, [
        h('circle', { key: 'a', cx: 10, cy: 10, r: 6.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', { key: 'b', d: 'M3.6 10h12.8M10 3.4c1.8 1.9 2.7 4.1 2.7 6.6s-.9 4.7-2.7 6.6c-1.8-1.9-2.7-4.1-2.7-6.6s.9-4.7 2.7-6.6Z', stroke: 'currentColor', strokeWidth: 1.2, strokeLinejoin: 'round' }),
      ])
    }

    function ExternalIcon({ size = 15 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M12.2 3.6h4.2v4.2', stroke: 'currentColor', strokeWidth: 1.35, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { key: 'b', d: 'M16.4 3.6 9.6 10.4', stroke: 'currentColor', strokeWidth: 1.35, strokeLinecap: 'round' }),
        h('path', { key: 'c', d: 'M14.2 11.4v4.1H4.5V5.8h4.1', stroke: 'currentColor', strokeWidth: 1.35, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      ])
    }

    function ReloadIcon({ size = 15 }) {
      return h(Icon, { size }, [
        h('path', { key: 'a', d: 'M15.4 10a5.4 5.4 0 1 1-1.9-4.1', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('path', { key: 'b', d: 'M15.8 3.6v3.1h-3.1', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      ])
    }

    function PanelIcon({ size = 20, active, ...rest }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 20 20',
        fill: 'none',
        'aria-hidden': true,
        style: { display: 'block', opacity: active ? 1 : 0.78, pointerEvents: 'auto' },
        ...rest,
      }, [
        h('path', {
          key: 'book',
          d: 'M2.6 4.4c1.7-.6 3.4-.3 4.9.8v10.4c-1.5-1.1-3.2-1.4-4.9-.8V4.4Z',
          stroke: 'currentColor', strokeWidth: 1.35, strokeLinejoin: 'round',
        }),
        h('path', {
          key: 'chat',
          d: 'M9 7.1h6.6v5.1H12l-2.1 1.9v-1.9H9V7.1Z',
          stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round',
        }),
        h('path', {
          key: 'chat-line',
          d: 'M11 9h3.1M11 10.6h2',
          stroke: 'currentColor', strokeWidth: 1.05, strokeLinecap: 'round',
        }),
      ])
    }

    /**
     * The sidebar icon doubles as the transition guard: retaining the selected
     * Session as `mainView` on pointer down keeps `uiSession.current` alive while
     * the Conversation is replaced by this panel. The Reader releases its own
     * reference; this one is released as soon as the panel changes.
     */
    function DeepReadIcon(props) {
      const { size, active, usePanelInfo, useCurrentSession, retainMain } = props
      const readSession = typeof useCurrentSession === 'function' ? useCurrentSession : null
      const currentId = readSession === null
        ? undefined
        : readSession((snapshot) => (snapshot === null || snapshot === undefined ? undefined : snapshot.key))
      const activePanel = usePanelInfo((info) => info.activePanelId)
      const holdRef = React.useRef(null)
      const heldId = React.useRef(null)

      const release = React.useCallback(() => {
        const held = holdRef.current
        holdRef.current = null
        heldId.current = null
        if (held === null) return
        try {
          held.release()
        } catch {
          // The Session may already be released by its controller.
        }
      }, [])

      const hold = React.useCallback(() => {
        if (typeof currentId !== 'string' || currentId === '' || heldId.current === currentId) return
        release()
        try {
          holdRef.current = retainMain(currentId)
          heldId.current = currentId
        } catch {
          holdRef.current = null
          heldId.current = null
        }
      }, [currentId, release, retainMain])

      React.useEffect(() => {
        if (activePanel === 'deepread') hold()
        else release()
      }, [activePanel, hold, release])

      React.useEffect(() => () => release(), [release])

      return h(PanelIcon, {
        size,
        active,
        onPointerDown: hold,
        onClick: hold,
      })
    }

    // ---------------------------------------------------------------------
    // Styles. Theme tokens only for chrome; the white page is the document.
    // ---------------------------------------------------------------------
    const CSS = `
.dr-root{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.45}
.dr-topbar{display:flex;align-items:center;gap:8px;flex:none;min-height:46px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;background:var(--dsw-alias-bg-layer-1)}
.dr-head-actions{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:8px;margin-left:auto;min-width:0}
.dr-icon-btn{position:relative}
.dr-count-badge{position:absolute;top:-4px;right:-4px;min-width:14px;height:14px;padding:0 3px;border-radius:7px;background:var(--dsw-alias-bg-layer-2);box-shadow:0 0 0 1px var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:9px;line-height:12px;text-align:center;font-variant-numeric:tabular-nums;pointer-events:none}
.dr-icon-spinner{position:absolute;top:-2px;right:-2px;width:10px;height:10px;border-width:1.2px}
.dr-tip::after{content:attr(data-tip);position:absolute;top:calc(100% + 8px);right:0;z-index:70;padding:4px 8px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-size:11px;line-height:1.4;white-space:nowrap;opacity:0;transform:translateY(-2px);pointer-events:none;transition:opacity .12s ease,transform .12s ease;box-shadow:0 8px 20px rgba(0,0,0,.18)}
.dr-tip:hover::after,.dr-tip:focus-visible::after{opacity:1;transform:none}
.dr-sep{flex:none;width:1px;height:18px;margin:0 2px;background:var(--dsw-alias-border-l1)}
.dr-more-wrap{position:relative;display:inline-flex}
.dr-more{position:absolute;top:calc(100% + 8px);right:0;z-index:72;min-width:224px;max-width:320px;display:flex;flex-direction:column;gap:2px;padding:6px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-overlay);box-shadow:0 14px 36px rgba(0,0,0,.22)}
.dr-more-row{display:flex;align-items:center;gap:8px;width:100%;padding:6px 8px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;text-align:left;cursor:pointer}
.dr-more-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dr-more-text{flex:1 1 auto;min-width:0}
.dr-more-count{flex:none;font-size:10px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.dr-more-check{flex:none;font-size:11px;color:var(--dsw-alias-brand-primary)}
.dr-more-block{display:flex;flex-direction:column;gap:5px;padding:5px 8px}
.dr-more-label{font-size:10px;color:var(--dsw-alias-label-secondary)}
.dr-more .dr-mode-switch{width:100%}
.dr-more .dr-mode-btn{flex:1 1 0;height:24px}
.dr-more .dr-session-select{flex:none;height:26px;width:100%;max-width:100%}
.dr-more-sep{height:1px;margin:4px 6px;background:var(--dsw-alias-border-l1)}
.dr-address-input{flex:1 1 180px;width:260px;max-width:260px;min-width:120px}
.dr-brand{display:inline-flex;align-items:center;gap:6px;flex:none;font-size:13px;font-weight:600;letter-spacing:.01em}
.dr-brand svg{color:var(--dsw-alias-brand-primary)}
.dr-doc-meta{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dr-spacer{flex:1 1 auto;min-width:8px}
.dr-group{display:inline-flex;align-items:center;gap:4px;flex:none}
.dr-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:28px;padding:0 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:12px;white-space:nowrap;transition:background .12s,color .12s,border-color .12s}
.dr-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dr-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dr-btn:disabled{opacity:.42;cursor:default}
.dr-btn.dr-primary{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);border-color:transparent}
.dr-btn.dr-primary:hover:not(:disabled){background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);filter:brightness(1.06)}
.dr-btn.dr-icon{width:28px;padding:0}
.dr-input{height:28px;min-width:0;padding:0 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}
.dr-input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:0}
.dr-input::placeholder{color:var(--dsw-alias-label-secondary);opacity:.75}
.dr-page-input{width:46px;text-align:center;padding:0 4px;font-variant-numeric:tabular-nums}
.dr-search-input{width:150px}
.dr-session-select{flex:0 1 148px;width:148px;min-width:84px;max-width:42%;font-size:11px;padding:0 5px}
.dr-match-count{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap;font-variant-numeric:tabular-nums}
.dr-split{display:flex;flex:1 1 auto;min-height:0;min-width:0}
.dr-pdf-pane{position:relative;display:flex;flex-direction:column;min-width:280px;min-height:0;background:var(--dsw-alias-bg-base);border-right:1px solid var(--dsw-alias-border-l1)}
.dr-divider{flex:0 0 6px;min-width:6px;cursor:col-resize;position:relative;background:transparent}
.dr-divider::after{content:"";position:absolute;inset:0 2px;border-radius:2px;background:transparent;transition:background .12s}
.dr-divider:hover::after,.dr-divider:focus-visible::after{background:var(--dsw-alias-border-l2)}
.dr-chat-pane{flex:1 1 0;display:flex;flex-direction:column;min-width:300px;min-height:0;background:var(--dsw-alias-bg-layer-1)}
.dr-pane-head{display:flex;align-items:center;gap:8px;flex:none;height:38px;padding:0 12px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:12px;color:var(--dsw-alias-label-secondary)}
.dr-pane-title{display:inline-flex;align-items:center;gap:6px;font-weight:500;color:var(--dsw-alias-label-primary)}
.dr-session-pill{display:inline-flex;align-items:center;gap:4px;height:20px;padding:0 7px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:10px;white-space:nowrap}
.dr-session-pill::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-state-success-primary)}
.dr-session-pill.dr-off::before{background:var(--dsw-alias-state-idle-primary)}
.dr-chat-body{flex:1 1 auto;min-height:0;display:flex;overflow:hidden;position:relative}
.dr-chat-host{display:flex;flex:1 1 auto;min-width:0;min-height:0;overflow:hidden}
.dr-chat-host>div{flex:1 1 auto;min-width:0;min-height:0}
.dr-chat-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:28px;text-align:center}
.dr-chat-empty h3{margin:0;font-size:14px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dr-chat-empty p{max-width:340px;margin:0;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.55}
.dr-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:36px;text-align:center;background:var(--dsw-alias-bg-base)}
.dr-empty svg{color:var(--dsw-alias-label-secondary);opacity:.7}
.dr-empty h3{margin:0;font-size:16px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dr-empty p{max-width:390px;margin:0;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6}
.dr-empty small{max-width:390px;color:var(--dsw-alias-label-secondary);opacity:.8;font-size:11px}
.dr-empty-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px}
.dr-viewer{flex:1 1 auto;min-height:0;overflow:auto;position:relative;padding:16px 16px 92px;background:var(--dsw-alias-bg-base);scrollbar-gutter:stable}
.dr-page{position:relative;width:calc(100% * var(--dr-zoom,1));margin:0 auto 16px;overflow:hidden;background:#fff;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,.16);isolation:isolate;content-visibility:auto;contain-intrinsic-size:auto 900px}
.dr-page img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:fill;user-select:none;-webkit-user-drag:none}
.dr-words{position:absolute;inset:0;overflow:hidden;pointer-events:none;user-select:text}
.dr-line{position:absolute;left:0;width:100%}
.dr-word{position:absolute;top:0;height:100%;overflow:hidden;color:transparent;font-family:inherit;font-size:8px;line-height:1;white-space:pre;cursor:text;pointer-events:auto;user-select:text}
.dr-word::selection{background:color-mix(in srgb, var(--dsw-alias-brand-primary) 36%, transparent)}
.dr-word[data-match="1"]{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 42%, transparent);border-radius:1px}
.dr-page-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-secondary);font-size:11px}
.dr-page-error{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;color:var(--dsw-alias-state-error-primary);font-size:11px;text-align:center}
.dr-spinner{width:14px;height:14px;border:1.6px solid var(--dsw-alias-border-l2);border-top-color:var(--dsw-alias-brand-primary);border-radius:50%;animation:dr-spin .7s linear infinite;display:inline-block;flex:none}
@keyframes dr-spin{to{transform:rotate(360deg)}}
.dr-selection{position:absolute;left:12px;right:12px;bottom:12px;z-index:16;display:flex;align-items:center;gap:8px;padding:7px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-overlay);box-shadow:0 8px 24px rgba(0,0,0,.18)}
.dr-selection-text{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--dsw-alias-label-secondary)}
.dr-selection-text b{font-weight:500;color:var(--dsw-alias-label-primary)}
.dr-webview{position:relative;display:flex;flex:1 1 auto;min-width:0;min-height:0;flex-direction:column;background:var(--dsw-alias-bg-base)}
.dr-zoom-wrap{position:absolute;inset:0;overflow:hidden;background:var(--dsw-alias-bg-base)}
.dr-webframe{position:absolute;top:0;left:0;border:0;transform-origin:0 0;background:var(--dsw-alias-bg-base)}
.dr-webview-loading{position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px}
.dr-webview-note{position:absolute;left:0;right:0;top:0;z-index:5;display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--dsw-alias-bg-layer-2);border-bottom:1px solid var(--dsw-alias-border-l2);font-size:11.5px;color:var(--dsw-alias-label-primary)}
.dr-webview-note span{flex:1 1 auto;min-width:0}
.dr-source-switch{margin-right:2px}
.dr-web-card{position:absolute;top:10px;right:10px;z-index:20;width:min(390px,calc(100% - 20px));max-height:calc(100% - 130px);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-overlay);box-shadow:0 12px 34px rgba(0,0,0,.2)}
.dr-web-head{display:flex;align-items:center;gap:6px;flex:none;padding:8px 9px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dr-web-head .dr-input{flex:1 1 auto}
.dr-web-body{flex:1 1 auto;min-height:0;overflow:auto;padding:6px 8px 8px}
.dr-web-note{padding:8px 4px;font-size:11px;line-height:1.55;color:var(--dsw-alias-label-secondary)}
.dr-web-item{display:block;padding:8px 6px;border-radius:7px;text-decoration:none;color:inherit}
.dr-web-item:hover{background:var(--dsw-alias-bg-layer-2)}
.dr-web-title{display:block;font-size:12px;font-weight:500;color:var(--dsw-alias-label-primary);line-height:1.4}
.dr-web-url{display:block;margin-top:2px;font-size:10px;color:var(--dsw-alias-brand-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dr-web-snippet{display:-webkit-box;margin-top:3px;overflow:hidden;font-size:11px;line-height:1.45;color:var(--dsw-alias-label-secondary);-webkit-line-clamp:3;-webkit-box-orient:vertical}
.dr-web-foot{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex:none;padding:6px 8px;border-top:1px solid var(--dsw-alias-border-l1)}
.dr-toast{position:absolute;top:56px;left:50%;z-index:40;transform:translateX(-50%);max-width:min(520px,calc(100% - 24px));padding:7px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;background:var(--dsw-alias-bg-overlay);box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:12px;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dr-toast.dr-bad{color:var(--dsw-alias-state-error-primary)}
.dr-error-line{flex:none;padding:7px 12px;font-size:12px;color:var(--dsw-alias-state-error-primary);border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dr-pane-head{flex-wrap:wrap;min-height:38px;height:auto;padding:4px 10px;row-gap:4px}
.dr-mode-switch{display:inline-flex;align-items:center;gap:1px;flex:none;height:26px;padding:2px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-base)}
.dr-mode-btn{height:20px;padding:0 7px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer;white-space:nowrap}
.dr-mode-btn:hover{color:var(--dsw-alias-label-primary)}
.dr-mode-btn[data-on="1"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 0 0 .5px var(--dsw-alias-border-l1)}
.dr-mode-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:0}
.dr-side-body{flex:1 1 auto;min-height:0;min-width:0;display:flex;flex-direction:column;position:relative}
.dr-chat-slot{display:flex;flex-direction:column;min-height:0;min-width:0;overflow:hidden}
.dr-side-divider{flex:0 0 5px;min-height:5px;cursor:row-resize;position:relative;background:var(--dsw-alias-bg-layer-1)}
.dr-side-divider::after{content:"";position:absolute;inset:2px 0;border-radius:2px;background:transparent;transition:background .12s}
.dr-side-divider:hover::after,.dr-side-divider:focus-visible::after{background:var(--dsw-alias-border-l2)}
.dr-term-slot{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;min-width:0;overflow:hidden;background:var(--dsw-alias-bg-base);border-top:1px solid var(--dsw-alias-border-l1)}
.dr-term-head{display:flex;align-items:center;gap:6px;flex:none;height:30px;padding:0 8px 0 10px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);font-size:11px;color:var(--dsw-alias-label-secondary)}
.dr-term-title{display:inline-flex;align-items:center;gap:5px;font-weight:500;color:var(--dsw-alias-label-primary);white-space:nowrap}
.dr-term-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;color:var(--dsw-alias-label-secondary);max-width:42%}
.dr-term-body{flex:1 1 auto;min-height:0;min-width:0;display:flex;overflow:hidden}
.dr-term-body>*{flex:1 1 auto;min-width:0;min-height:0}
.dr-term-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:18px;text-align:center;background:var(--dsw-alias-bg-base)}
.dr-term-empty h3{margin:0;font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dr-term-empty p{max-width:320px;margin:0;font-size:11px;line-height:1.5;color:var(--dsw-alias-label-secondary)}
.dr-term-empty .dr-btn{margin-top:5px}
.dr-term-status{flex:none;padding:4px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:11px;line-height:1.45;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-2)}
.dr-toc{position:absolute;top:10px;left:10px;bottom:10px;z-index:18;width:min(310px,72%);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-overlay);box-shadow:0 12px 34px rgba(0,0,0,.18)}
.dr-toc-head{display:flex;align-items:center;gap:6px;flex:none;padding:8px 9px 7px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dr-toc-title{flex:1;min-width:0;font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dr-toc-count{flex:none;font-size:10px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.dr-toc-filter{display:flex;flex:none;gap:4px;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dr-toc-filter .dr-input{flex:1 1 auto;height:24px;font-size:11px}
.dr-toc-body{flex:1 1 auto;min-height:0;overflow:auto;padding:4px 4px 8px}
.dr-toc-row{display:flex;align-items:center;gap:1px;min-height:27px;border-radius:6px;padding-right:6px;color:var(--dsw-alias-label-primary)}
.dr-toc-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dr-toc-row[data-active="1"]{background:color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent)}
.dr-toc-twist{flex:none;width:18px;height:24px;border:0;background:transparent;padding:0;display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dr-toc-twist:hover{color:var(--dsw-alias-label-primary)}
.dr-toc-twist svg{width:12px;height:12px}
.dr-toc-twist.dr-space{cursor:default}
.dr-toc-title-btn{flex:1 1 auto;min-width:0;border:0;background:transparent;padding:5px 0;text-align:left;font:inherit;font-size:12px;line-height:1.35;color:inherit;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dr-toc-title-btn:disabled{color:var(--dsw-alias-label-secondary);cursor:default}
.dr-toc-title-btn:hover:not(:disabled){color:var(--dsw-alias-brand-primary)}
.dr-toc-page{flex:none;font-size:10px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.dr-toc-note{padding:12px 8px;font-size:11px;line-height:1.5;color:var(--dsw-alias-label-secondary)}
.dr-toc-actions{display:flex;gap:4px;flex:none;padding:0 8px 7px}
.dr-toc-actions .dr-btn{height:24px;font-size:10px}


@media (max-width:900px){.dr-search-input{width:110px}.dr-address-input{flex:0 1 170px;width:170px}.dr-chat-pane{min-width:240px}}
@media (max-width:760px){.dr-split{flex-direction:column}.dr-pdf-pane{flex:0 0 56%!important;min-width:0;border-right:none;border-bottom:1px solid var(--dsw-alias-border-l1)}.dr-chat-pane{flex:1 1 auto;min-width:0;min-height:220px}.dr-divider{display:none}.dr-selection{left:8px;right:8px;bottom:8px}}
.dr-split.dr-reader-only .dr-pdf-pane{flex:1 1 auto!important;border-right:none;border-bottom:none}
.dr-search-group{position:relative}
.dr-count-btn{border:0;background:transparent;padding:2px 6px;border-radius:6px;cursor:pointer;font:inherit;color:var(--dsw-alias-label-secondary)}
.dr-count-btn:hover,.dr-count-btn[aria-expanded="true"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dr-search-results{position:absolute;top:calc(100% + 8px);right:0;z-index:36;width:min(520px,88vw);max-height:min(360px,60vh);overflow:auto;padding:6px;display:flex;flex-direction:column;gap:2px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-overlay);box-shadow:0 14px 36px rgba(0,0,0,.22)}
.dr-search-result{display:grid;grid-template-columns:44px minmax(0,1fr) 34px;gap:8px;align-items:center;padding:6px 8px;border:0;border-radius:6px;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}
.dr-search-result:hover,.dr-search-result.dr-active{background:var(--dsw-alias-bg-layer-2)}
.dr-result-page{font-size:11px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}
.dr-result-snippet{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--dsw-alias-label-primary)}
.dr-result-count{font-size:11px;text-align:right;color:var(--dsw-alias-label-secondary)}
.dr-marks{position:absolute;inset:0;pointer-events:none;z-index:0}
.dr-mark{position:absolute;border-radius:2px;mix-blend-mode:multiply;background:rgba(255,214,0,.38)}
.dr-mark[data-color="green"]{background:rgba(48,196,120,.34)}
.dr-mark[data-color="blue"]{background:rgba(64,150,255,.30)}
.dr-mark[data-color="pink"]{background:rgba(255,110,165,.32)}
.dr-mark[data-color="purple"]{background:rgba(150,115,255,.30)}
.dr-notes{width:min(350px,80%)}
.dr-note-row{display:flex;align-items:center;gap:5px;padding:2px 4px;border-radius:6px}
.dr-note-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dr-note-row.dr-active{background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent)}
.dr-note-jump{flex:1 1 auto;min-width:0;display:flex;align-items:baseline;gap:6px;border:0;background:transparent;padding:4px 2px;text-align:left;font:inherit;color:inherit;cursor:pointer}
.dr-note-page{flex:none;font-size:10px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.dr-note-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
.dr-note-dot{flex:none;width:9px;height:9px;border-radius:50%;background:rgba(255,214,0,.95);box-shadow:0 0 0 1px rgba(0,0,0,.12)}
.dr-note-dot[data-color="green"]{background:rgba(48,196,120,.95)}
.dr-note-dot[data-color="blue"]{background:rgba(64,150,255,.95)}
.dr-note-dot[data-color="pink"]{background:rgba(255,110,165,.95)}
.dr-note-dot[data-color="purple"]{background:rgba(150,115,255,.95)}
.dr-note-action{height:22px;font-size:10px;padding:0 6px}
.dr-note-editor{flex:none;display:flex;flex-direction:column;gap:6px;padding:8px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dr-note-colors{display:flex;gap:6px}
.dr-note-swatch{width:18px;height:18px;padding:0;border-radius:50%;border:1px solid var(--dsw-alias-border-l2);background:rgba(255,214,0,.95);cursor:pointer}
.dr-note-swatch[data-color="green"]{background:rgba(48,196,120,.95)}
.dr-note-swatch[data-color="blue"]{background:rgba(64,150,255,.95)}
.dr-note-swatch[data-color="pink"]{background:rgba(255,110,165,.95)}
.dr-note-swatch[data-color="purple"]{background:rgba(150,115,255,.95)}
.dr-note-swatch.dr-active{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dr-note-input{width:100%;min-height:58px;resize:vertical;font-size:11px;line-height:1.5}
.dr-note-actions{display:flex;gap:6px;justify-content:flex-end}
.dr-docs{width:min(390px,84%)}
.dr-doc-row{display:flex;align-items:center;gap:6px;padding:2px 4px;border-radius:6px}
.dr-doc-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dr-doc-row.dr-active{background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent)}
.dr-doc-open{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px;border:0;background:transparent;padding:5px 4px;text-align:left;font:inherit;color:inherit;cursor:pointer}
.dr-doc-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--dsw-alias-label-primary)}
.dr-doc-meta{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;color:var(--dsw-alias-label-secondary)}
.dr-btn.dr-bad{color:var(--dsw-alias-state-error-primary)}
`

    function StyleTag() {
      return h('style', { 'data-deepread-style': '1' }, CSS)
    }

    function joinUrl(base, path) {
      return `${base}${path}`
    }

    // ---------------------------------------------------------------------
    // PDF helpers
    // ---------------------------------------------------------------------
    function groupWords(words) {
      if (!Array.isArray(words) || words.length === 0) return []
      const buckets = new Map()
      for (const word of words) {
        if (!Array.isArray(word) || word.length < 5) continue
        const [x0, y0, x1, y1, text] = word
        const key = Math.round(y0 / 2.2)
        let bucket = buckets.get(key)
        if (bucket === undefined) {
          bucket = { y0, y1, words: [] }
          buckets.set(key, bucket)
        }
        bucket.y0 = Math.min(bucket.y0, y0)
        bucket.y1 = Math.max(bucket.y1, y1)
        bucket.words.push({ x0, x1, y0, y1, text })
      }
      return [...buckets.values()]
        .map((line) => ({ ...line, words: line.words.sort((a, b) => a.x0 - b.x0) }))
        .sort((a, b) => a.y0 - b.y0)
    }

    function readSelection(container) {
      if (container === null || container === undefined) return ''
      const selection = window.getSelection()
      if (selection === null || selection.rangeCount === 0 || selection.isCollapsed) return ''
      const range = selection.getRangeAt(0)
      const start = range.startContainer
      const end = range.endContainer
      if (!container.contains(start) && !container.contains(end)) return ''
      const parts = []
      let lastPage = null
      let lastLine = null
      let previous = null
      const cjk = /[\u3400-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/
      // Only the pages the range touches: a long book holds tens of thousands
      // of word nodes, and testing every one of them is what made selection
      // capture slow.
      const words = []
      for (const page of container.querySelectorAll('.dr-page')) {
        let inPage = false
        try {
          inPage = range.intersectsNode(page)
        } catch {
          inPage = false
        }
        if (inPage) words.push(...page.querySelectorAll('.dr-word'))
      }
      for (const word of words) {
        let hit = false
        try {
          hit = range.intersectsNode(word)
        } catch {
          hit = false
        }
        if (!hit) continue
        const page = word.dataset.page
        const line = word.dataset.line
        const text = word.dataset.text ?? ''
        if (lastPage !== null && page !== lastPage) parts.push('\n\n')
        else if (lastLine !== null && line !== lastLine) parts.push('\n')
        else if (previous !== null && !(cjk.test(previous) && cjk.test(text))) parts.push(' ')
        parts.push(text)
        previous = text
        lastPage = page
        lastLine = line
      }
      let text = parts.join('')
      text = text.replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
      return text === '' ? selection.toString().trim() : text
    }

    // ---------------------------------------------------------------------
    // Page renderer: image under an absolutely positioned text layer. The
    // word boxes come from Poppler, so selection and copy are native.
    // ---------------------------------------------------------------------
    const EMPTY_MARKS = Object.freeze([])

    const PageView = React.memo(function PageView({ docId, pageNumber, page, highlight, imageDpi, marks }) {
      const shellRef = React.useRef(null)
      const [visible, setVisible] = React.useState(false)
      const [words, setWords] = React.useState(null)
      const [loaded, setLoaded] = React.useState(false)

      React.useEffect(() => {
        const element = shellRef.current
        if (element === null) return undefined
        if (typeof IntersectionObserver !== 'function') {
          setVisible(true)
          return undefined
        }
        const observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisible(true)
            observer.disconnect()
          }
        }, { rootMargin: '900px 0px' })
        observer.observe(element)
        return () => observer.disconnect()
      }, [])

      React.useEffect(() => {
        if (!visible) return undefined
        let cancelled = false
        fetch(apiUrl(`/text/${docId}/${pageNumber}`))
          .then((response) => readJsonResponse(response))
          .then((value) => {
            if (!cancelled) setWords(Array.isArray(value?.words) ? value.words : [])
          })
          .catch(() => {
            if (!cancelled) setWords([])
          })
        return () => { cancelled = true }
      }, [visible, docId, pageNumber])

      const width = page && page.width > 0 ? page.width : 612
      const height = page && page.height > 0 ? page.height : 792
      const lines = React.useMemo(() => groupWords(words), [words])
      const tokens = React.useMemo(() => {
        const query = (highlight || '').trim().toLowerCase()
        return query === '' ? [] : query.split(/\s+/).filter((token) => token.length > 0).slice(0, 8)
      }, [highlight])

      return h('div', {
        ref: shellRef,
        className: 'dr-page',
        'data-page': pageNumber,
        style: { aspectRatio: `${width} / ${height}` },
      }, [
        h('img', {
          key: 'img',
          src: apiUrl(`/page/${docId}/${pageNumber}?dpi=${imageDpi}`),
          alt: '',
          draggable: false,
          loading: 'lazy',
          onLoad: () => setLoaded(true),
          onError: () => setLoaded(true),
        }),
        !loaded && h('div', { key: 'load', className: 'dr-page-loading' }, h('span', { className: 'dr-spinner' })),
        loaded && words === null && h('div', { key: 'words-loading', className: 'dr-page-loading' }, h('span', { className: 'dr-spinner' })),
        marks !== undefined && marks.length > 0 && h('div', { key: 'marks', className: 'dr-marks' },
          marks.flatMap((mark) => (Array.isArray(mark.boxes) ? mark.boxes : []).map((box, index) => h('div', {
            key: `${mark.id}-${index}`,
            className: 'dr-mark',
            'data-color': mark.color,
            style: {
              left: `${box.x * 100}%`,
              top: `${box.y * 100}%`,
              width: `${box.w * 100}%`,
              height: `${box.h * 100}%`,
            },
          })))),
        h('div', {
          key: 'words',
          className: 'dr-words',
          'data-page': pageNumber,
        }, lines.map((line, lineIndex) => h('div', {
          key: `line-${lineIndex}`,
          className: 'dr-line',
          'data-line': lineIndex,
          style: {
            top: `${(line.y0 / height) * 100}%`,
            height: `${Math.max(0.65, ((line.y1 - line.y0) / height) * 100)}%`,
            left: 0,
            width: '100%',
          },
        }, line.words.map((word, wordIndex) => {
          const text = word.text
          const lower = text.toLowerCase()
          const match = tokens.length > 0 && tokens.some((token) => lower.includes(token))
          return h('span', {
            key: `w-${lineIndex}-${wordIndex}`,
            className: 'dr-word',
            'data-page': pageNumber,
            'data-line': lineIndex,
            'data-text': text,
            'data-match': match ? '1' : undefined,
            style: {
              left: `${(word.x0 / width) * 100}%`,
              width: `${Math.max(0.15, ((word.x1 - word.x0) / width) * 100)}%`,
            },
          }, text)
        })))),
      ])
    })

    // ---------------------------------------------------------------------
    // Conversation pane: the real session content, rendered with the same
    // factory the host conversation and the subagent sidebar tab use.
    // ---------------------------------------------------------------------
    class ChatBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { failed: false }
      }

      static getDerivedStateFromError() {
        return { failed: true }
      }

      componentDidCatch(error) {
        console.error('deepread: conversation pane crashed', error)
      }

      render() {
        if (this.state.failed) {
          return h('div', { className: 'dr-chat-empty' }, [
            h('h3', { key: 't' }, this.props.title),
            h('p', { key: 'b' }, this.props.body),
          ])
        }
        return this.props.children
      }
    }

    function FixedChatView(props) {
      return props.renderSlot('conversation.session', { view: 'chat' })
    }

    function ChatPane({ sessionId, useSession, useConversation, useSessions, renderFactorySlot }) {
      const session = useSession((value) => value)
      const conversation = useConversation((value) => value)
      const summaryBlank = useSessions((state) => state.byId[sessionId]?.blank)
      const shellPhase = conversation.activeTargets.size > 0 || (!session.blank && !session.awaitingFirstTurn) || session.running
        ? 'active'
        : session.promptAttempted ? 'engaging' : 'blank'
      const settling = shellPhase === 'blank' && session.openState === 'loading' && summaryBlank !== true
      const hero = shellPhase === 'blank' && (session.openState === 'open' || summaryBlank === true)
      return h('div', { className: 'dr-chat-host' },
        renderFactorySlot('conversation.content', {
          variant: 'embedded',
          phase: settling ? 'settling' : hero ? 'hero' : 'active',
          hero,
        }, { slots: { views: FixedChatView } }),
      )
    }

    // ---------------------------------------------------------------------
    // Outline tree
    // ---------------------------------------------------------------------
    function buildOutlineTree(rows) {
      const root = { children: [] }
      const stack = []
      let index = 0
      for (const row of rows) {
        if (row === null || typeof row !== 'object' || typeof row.title !== 'string') continue
        const depth = Number.isInteger(row.depth) ? Math.max(0, Math.min(row.depth, 12)) : 0
        while (stack.length > depth) stack.pop()
        const parent = stack.length === 0 ? root : stack[stack.length - 1]
        const node = {
          id: `outline-${index++}`,
          title: row.title,
          page: Number.isInteger(row.page) && row.page > 0 ? row.page : 0,
          depth,
          children: [],
        }
        parent.children.push(node)
        stack.push(node)
      }
      return root.children
    }

    function filterOutline(nodes, query) {
      const needle = query.trim().toLowerCase()
      if (needle === '') return nodes
      const out = []
      for (const node of nodes) {
        const children = filterOutline(node.children, needle)
        if (node.title.toLowerCase().includes(needle) || children.length > 0) {
          out.push({ ...node, children })
        }
      }
      return out
    }

    function collectOutlineIds(nodes, predicate, into = new Set()) {
      for (const node of nodes) {
        if (predicate(node)) into.add(node.id)
        collectOutlineIds(node.children, predicate, into)
      }
      return into
    }

    function OutlineNode({ node, depth, expanded, onToggle, onJump, activeId, forceOpen }) {
      const hasChildren = node.children.length > 0
      const open = forceOpen || expanded.has(node.id)
      return h(React.Fragment, null, [
        h('div', {
          key: `row-${node.id}`,
          className: 'dr-toc-row',
          'data-active': node.id === activeId ? '1' : undefined,
          style: { paddingLeft: `${4 + Math.min(depth, 12) * 12}px` },
        }, [
          hasChildren
            ? h('button', {
              key: 'twist',
              type: 'button',
              className: 'dr-toc-twist',
              'aria-expanded': open,
              onClick: () => onToggle(node.id),
            }, h(ChevronIcon, { size: 12, direction: open ? 'down' : 'right' }))
            : h('span', { key: 'twist', className: 'dr-toc-twist dr-space' }),
          h('button', {
            key: 'title',
            type: 'button',
            className: 'dr-toc-title-btn',
            disabled: node.page <= 0,
            title: node.title,
            onClick: () => {
              if (node.page > 0) onJump(node.page)
            },
          }, node.title),
          h('span', { key: 'page', className: 'dr-toc-page' }, node.page > 0 ? String(node.page) : ''),
        ]),
        hasChildren && open ? node.children.map((child) => h(OutlineNode, {
          key: `node-${child.id}`,
          node: child,
          depth: depth + 1,
          expanded,
          onToggle,
          onJump,
          activeId,
          forceOpen,
        })) : null,
      ])
    }

    // ---------------------------------------------------------------------
    // Terminal pane. The built-in terminal UI lives in the terminal package's
    // lazy chunk; load that chunk through the client module system and drive it
    // with a terminal view created for this panel.
    // ---------------------------------------------------------------------
    const TerminalHost = React.memo(function TerminalHost({ runtime, sessionId, cwd, tx, visible }) {
      const [Body, setBody] = React.useState(null)
      const [bodyError, setBodyError] = React.useState('')
      const [view, setView] = React.useState(null)
      const [viewError, setViewError] = React.useState('')
      /** A generation is a content identity, so "New terminal" mints a new process. */
      const genStorage = sessionId ? `dsh.deepread.termgen.${sessionId}` : ''
      const [generation, setGeneration] = React.useState(() => {
        if (!sessionId) return 0
        const stored = Number(safeGet(`dsh.deepread.termgen.${sessionId}`))
        return Number.isInteger(stored) && stored >= 0 && stored < 1_000_000 ? stored : 0
      })
      const contentId = `deepread-terminal-${generation}`

      React.useEffect(() => {
        if (Body !== null || !visible) return undefined
        let cancelled = false
        runtime.load().then((component) => {
          if (!cancelled) setBody(() => component)
        }).catch((error) => {
          if (!cancelled) setBodyError(error instanceof Error ? error.message : String(error))
        })
        return () => { cancelled = true }
      }, [runtime, Body, visible])

      // A view of our own, used by this pane only. It never creates a sidebar
      // tab, so following the Session cannot open the right sidebar. The view
      // owns the screen attachment; the Host process outlives an unmount, and
      // the saved content identity reattaches to that same process the next
      // time the pane mounts, until the controller reclaims an idle terminal.
      React.useEffect(() => {
        if (!sessionId || !visible) {
          setView(null)
          return undefined
        }
        try {
          const next = runtime.viewStandalone(sessionId, contentId)
          setView(next)
          setViewError('')
        } catch (error) {
          setView(null)
          setViewError(error instanceof Error ? error.message : String(error))
        }
        return undefined
      }, [runtime, sessionId, visible, contentId])

      const restart = React.useCallback(() => {
        if (!sessionId) return
        if (view !== null) {
          try {
            runtime.closeStandalone(sessionId, contentId, view.id)
          } catch {
            // The process may already have ended.
          }
        }
        const next = generation + 1
        if (genStorage !== '') {
          try {
            safeSet(genStorage, String(next))
          } catch {
            // Storage is optional; the in-memory generation still changes.
          }
        }
        setView(null)
        setViewError('')
        setGeneration(next)
      }, [sessionId, view, runtime, contentId, generation, genStorage])

      const useTerminal = React.useMemo(() => {
        if (view === null) return function useEmptyTerminal() { return undefined }
        const subscribe = (listener) => view.state.subscribe(listener)
        const read = () => view.state.getSnapshot()
        return function useTerminalState(_key, selector) {
          const state = React.useSyncExternalStore(subscribe, read, read)
          return selector === undefined ? state : selector(state)
        }
      }, [view])
      const theme = React.useSyncExternalStore(runtime.theme.subscribe, runtime.theme.getSnapshot, runtime.theme.getSnapshot)
      const useTheme = React.useCallback((selector) => (
        selector === undefined ? theme : selector(theme)
      ), [theme])

      const useTabInfo = React.useCallback(() => ({
        tab: {
          id: contentId,
          visible,
          actions: { openTab: () => { restart() } },
        },
      }), [contentId, visible, restart])

      const cwdLabel = typeof cwd === 'string' && cwd !== '' ? cwd.split('/').filter(Boolean).pop() : ''

      return h('div', {
        className: 'dr-term-pane',
        'data-terminal-tab': contentId,
        style: { display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, minWidth: 0 },
      }, [
        h('div', { key: 'head', className: 'dr-term-head' }, [
          h('span', { key: 'title', className: 'dr-term-title' }, [h(TerminalIcon, { key: 'i', size: 14 }), tx('term.title')]),
          cwdLabel !== '' && h('span', { key: 'cwd', className: 'dr-term-name', title: cwd }, cwdLabel),
          h('span', { key: 'space', className: 'dr-spacer' }),
          h('button', {
            key: 'new',
            type: 'button',
            className: 'dr-btn',
            onClick: restart,
            disabled: !sessionId || view === null,
          }, [h(PlusIcon, { key: 'i' }), tx('term.new')]),
        ]),
        h('div', { key: 'body', className: 'dr-term-body' },
          !sessionId
            ? h('div', { className: 'dr-term-empty' }, [
              h('h3', { key: 't' }, tx('term.emptyTitle')),
              h('p', { key: 'b' }, tx('term.emptyBody')),
            ])
            : viewError !== ''
              ? h('div', { className: 'dr-term-empty' }, [
                h('h3', { key: 't' }, tx('term.title')),
                h('p', { key: 'b' }, viewError),
                h('button', { key: 'n', type: 'button', className: 'dr-btn dr-primary', onClick: restart }, tx('term.new')),
              ])
              : bodyError !== ''
                ? h('div', { className: 'dr-term-empty' }, [
                  h('h3', { key: 't' }, tx('term.title')),
                  h('p', { key: 'b' }, tx('term.unavailable', { message: bodyError })),
                ])
                : Body === null || view === null
                  ? h('div', { className: 'dr-term-empty' }, [
                    h('span', { key: 's', className: 'dr-spinner' }),
                    h('p', { key: 'b' }, tx('term.loading')),
                  ])
                  : h(Body, { useTabInfo, useTerminal, useTheme, view: () => view, t: runtime.t }),
        ),
      ])
    })

    // ---------------------------------------------------------------------
    // Main panel
    // ---------------------------------------------------------------------
    function ReaderPage(props) {
      const {
        t,
        useCurrentSession,
        useSessions,
        SessionProvider,
        renderSlot,
        retainSession,
        startSession,
        selectConversation,
        terminalRuntime,
      } = props

      const tx = React.useCallback((key, params) => format(t, key, params), [t])
      const readSession = typeof useCurrentSession === 'function' ? useCurrentSession : null
      const currentId = readSession === null
        ? undefined
        : readSession((snapshot) => (snapshot === null || snapshot === undefined ? undefined : snapshot.key))
      const sessionIds = useSessions((state) => state.ids)
      const sessionsById = useSessions((state) => state.byId)
      const [pickedSession, setPickedSession] = React.useState(() => {
        const stored = safeGet('dsh.deepread.session')
        return typeof stored === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(stored) ? stored : ''
      })
      const [lastSeen, setLastSeen] = React.useState(() => {
        const stored = safeGet('dsh.deepread.lastSession')
        return typeof stored === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(stored) ? stored : ''
      })
      const sessionId = pickedSession !== '' ? pickedSession : (currentId || lastSeen || undefined)

      React.useEffect(() => {
        if (typeof currentId !== 'string' || currentId === '') return
        setLastSeen(currentId)
        try {
          safeSet('dsh.deepread.lastSession', currentId)
        } catch {
          // Storage can be unavailable; the in-memory value still works.
        }
      }, [currentId])

      React.useEffect(() => {
        if (pickedSession === '' || !Array.isArray(sessionIds) || sessionIds.length === 0) return
        if (sessionIds.includes(pickedSession)) return
        setPickedSession('')
        try {
          safeRemove('dsh.deepread.session')
        } catch {
          // Ignore storage failures.
        }
      }, [pickedSession, sessionIds])

      function chooseSession(id) {
        setPickedSession(id)
        try {
          if (id === '') safeRemove('dsh.deepread.session')
          else safeSet('dsh.deepread.session', id)
        } catch {
          // Ignore storage failures.
        }
      }

      function beginNewSession() {
        chooseSession('')
        startSession()
      }

      const [reference, setReference] = React.useState(null)
      const [chatError, setChatError] = React.useState('')

      const [doc, setDoc] = React.useState(null)
      const [docError, setDocError] = React.useState('')
      const [busy, setBusy] = React.useState('')
      const [zoom, setZoom] = React.useState(1)
      // Page images arrive as rasters; ask for a denser one on retina screens
      // and while zoomed in, then step it only when the value really changes.
      const [imageDpi, setImageDpi] = React.useState(() => {
        const ratio = typeof window.devicePixelRatio === 'number' ? Math.min(2, window.devicePixelRatio) : 1
        return Math.min(300, Math.max(96, Math.round((130 * ratio) / 10) * 10))
      })
      React.useEffect(() => {
        const ratio = typeof window.devicePixelRatio === 'number' ? Math.min(2, window.devicePixelRatio) : 1
        const wanted = Math.min(300, Math.max(96, Math.round((130 * ratio * zoom) / 10) * 10))
        const timer = window.setTimeout(() => setImageDpi(wanted), 350)
        return () => window.clearTimeout(timer)
      }, [zoom])

      // The desktop window draws its traffic lights over the top-left corner.
      // When this panel sits at the window edge, the first row has to start
      // clear of them or a click on our own controls can hit the close button.
      const topbarRef = React.useRef(null)
      const moreWrapRef = React.useRef(null)
      const [barWidth, setBarWidth] = React.useState(0)
      const [moreOpen, setMoreOpen] = React.useState(false)
      const compactBar = barWidth > 0 && barWidth < 1460
      const tightBar = barWidth > 0 && barWidth < 1200
      const webTight = barWidth > 0 && barWidth < 1400
      const [trafficInset, setTrafficInset] = React.useState(0)
      React.useEffect(() => {
        const element = rootRef.current
        if (element === null) return undefined
        function measure() {
          const rect = element.getBoundingClientRect()
          let inset = rect.top < 30 ? Math.max(0, 84 - rect.left) : 0
          // The application keeps its sidebar toggle and new-session button in
          // this same top-left strip. When the panel reaches the window edge,
          // start after those controls instead of underneath them.
          if (rect.left < 40) {
            for (const control of document.querySelectorAll('button, [role="button"]')) {
              if (element.contains(control)) continue
              const box = control.getBoundingClientRect()
              if (box.width === 0 || box.height === 0) continue
              if (box.top > 60 || box.left > 500) continue
              inset = Math.max(inset, Math.ceil(box.right + 10 - rect.left - 12))
            }
          }
          setTrafficInset(Math.max(0, Math.min(260, Math.ceil(inset))))
        }
        measure()
        const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
        if (observer !== null) observer.observe(element)
        window.addEventListener('resize', measure)
        const late = [window.setTimeout(measure, 400), window.setTimeout(measure, 1200)]
        return () => {
          if (observer !== null) observer.disconnect()
          window.removeEventListener('resize', measure)
          for (const timer of late) window.clearTimeout(timer)
        }
      }, [])

      React.useEffect(() => {
        const element = topbarRef.current
        if (element === null) return undefined
        function measureBar() {
          setBarWidth(element.getBoundingClientRect().width)
        }
        measureBar()
        const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measureBar) : null
        if (observer !== null) observer.observe(element)
        window.addEventListener('resize', measureBar)
        return () => {
          if (observer !== null) observer.disconnect()
          window.removeEventListener('resize', measureBar)
        }
      }, [])

      React.useEffect(() => {
        if (!compactBar) setMoreOpen(false)
      }, [compactBar])

      React.useEffect(() => {
        if (!moreOpen) return undefined
        function onPointerDown(event) {
          const wrap = moreWrapRef.current
          if (wrap !== null && wrap.contains(event.target)) return
          setMoreOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        return () => document.removeEventListener('pointerdown', onPointerDown, true)
      }, [moreOpen])
      const [split, setSplit] = React.useState(() => {
        const saved = Number(safeGet('dsh.deepread.split'))
        return Number.isFinite(saved) && saved >= 30 && saved <= 78 ? saved : 54
      })
      const [pageInput, setPageInput] = React.useState('1')
      const [searchQuery, setSearchQuery] = React.useState('')
      const [search, setSearch] = React.useState(null)
      const [searchOpen, setSearchOpen] = React.useState(false)
      const searchGroupRef = React.useRef(null)
      const searchInputRef = React.useRef(null)
      const [marks, setMarks] = React.useState([])
      const [notesOpen, setNotesOpen] = React.useState(false)
      const [activeMarkId, setActiveMarkId] = React.useState(null)
      const [noteDraft, setNoteDraft] = React.useState('')
      const [markColor, setMarkColor] = React.useState('yellow')
      const [notesBusy, setNotesBusy] = React.useState(false)
      const [docsOpen, setDocsOpen] = React.useState(false)
      const [docs, setDocs] = React.useState([])
      const [docsBusy, setDocsBusy] = React.useState(false)
      const [pendingRemoveId, setPendingRemoveId] = React.useState(null)
      const [selection, setSelection] = React.useState(null)
      const [web, setWeb] = React.useState(null)
      /**
       * PDF and web page are two sources of one reading pane: the toolbar swaps
       * its document controls, the left pane swaps its content, and the
       * conversation, terminal and selection bar stay exactly where they are.
       */
      const [source, setSource] = React.useState(() => (
        safeGet('dsh.deepread.source') === 'web' ? 'web' : 'pdf'
      ))
      const [webNav, setWebNav] = React.useState(() => {
        const stored = safeGet('dsh.deepread.weburl')
        const valid = typeof stored === 'string' ? normalizeAddress(stored) : null
        return valid === null || stored === '' ? { entries: [], index: 0 } : { entries: [stored], index: 0 }
      })
      const [webAddress, setWebAddress] = React.useState('')
      const [webMode, setWebMode] = React.useState(() => (
        safeGet('dsh.deepread.webmode') === 'direct' ? 'direct' : 'read'
      ))
      const [webTitle, setWebTitle] = React.useState('')
      const [webLoading, setWebLoading] = React.useState(false)
      const [webNonce, setWebNonce] = React.useState(0)
      /**
       * Page zoom, like a browser's: the frame lays out at `viewport / zoom`
       * CSS pixels and is scaled back up, so text reflows instead of turning
       * into a magnified bitmap. 0.5–2 in steps of 0.1.
       */
      const [webZoom, setWebZoom] = React.useState(() => {
        const stored = Number(safeGet('dsh.deepread.webzoom'))
        return Number.isFinite(stored) && stored >= 0.5 && stored <= 2 ? Math.round(stored * 10) / 10 : 1
      })
      const [webViewport, setWebViewport] = React.useState({ width: 0, height: 0 })
      const [webFindQuery, setWebFindQuery] = React.useState('')
      const [webFind, setWebFind] = React.useState({ total: 0, index: 0 })
      const webUrl = webNav.entries[webNav.index] ?? ''
      const [toast, setToast] = React.useState(null)
      const [asking, setAsking] = React.useState(false)
      const [outline, setOutline] = React.useState({ state: 'idle', rows: [], error: '' })
      const [tocOpen, setTocOpen] = React.useState(() => safeGet('dsh.deepread.toc') === '1')
      const [tocFilter, setTocFilter] = React.useState('')
      const [expanded, setExpanded] = React.useState(() => new Set())
      const [currentPage, setCurrentPage] = React.useState(1)
      const [sideMode, setSideMode] = React.useState(() => {
        const saved = safeGet('dsh.deepread.sidemode')
        return saved === 'chat' || saved === 'terminal' || saved === 'split' ? saved : 'split'
      })
      const [sideSplit, setSideSplit] = React.useState(() => {
        const saved = Number(safeGet('dsh.deepread.sidesplit'))
        return Number.isFinite(saved) && saved >= 28 && saved <= 75 ? saved : 55
      })
      const [termEnabled, setTermEnabled] = React.useState(sideMode !== 'chat')
      /**
       * Reading-only: the right pane keeps its conversation and terminal
       * mounted, but is hidden, so the document gets the whole width. The
       * side mode and split stay untouched, so expanding restores exactly the
       * layout the reader had before.
       */
      const [readerOnly, setReaderOnly] = React.useState(() => safeGet('dsh.deepread.readeronly') === '1')
      // With nothing open there is no reading area to widen, so the preference
      // only applies with a document and the toggle is not offered without one.
      const hasContent = doc !== null || (source === 'web' && webUrl !== '')
      const collapsed = readerOnly && hasContent

      const rootRef = React.useRef(null)
      const viewerRef = React.useRef(null)
      const webFrameRef = React.useRef(null)
      const webZoomWrapRef = React.useRef(null)
      const fileRef = React.useRef(null)
      const pageInputRef = React.useRef(null)
      const sideRef = React.useRef(null)
      const rightPaneRef = React.useRef(null)
      const terminalSlotRef = React.useRef(null)
      const dragRef = React.useRef(null)
      const sideDragRef = React.useRef(null)
      const searchSeq = React.useRef(0)
      const docRef = React.useRef(null)
      const zoomRef = React.useRef(1)
      const currentPageRef = React.useRef(1)
      const savedPositionRef = React.useRef(null)
      const positionRef = React.useRef(null)
      const saveTimerRef = React.useRef(0)
      const hostTimerRef = React.useRef(0)

      docRef.current = doc
      zoomRef.current = zoom
      currentPageRef.current = currentPage

      const sessionRef = React.useRef(sessionId)
      sessionRef.current = sessionId

      async function loadStoredPosition(id) {
        const local = readLocalPosition(id)
        try {
          const options = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
            ? { signal: AbortSignal.timeout(2500) }
            : {}
          const response = await fetch(apiUrl(`/position/${id}`), options)
          const value = await readJsonResponse(response)
          const remote = normalizeStoredPosition(value?.position)
          if (remote !== null && (local === null || remote.at >= local.at)) return remote
        } catch {
          // An older Host, offline restore, or a slow request all fall back to
          // the browser's own copy.
        }
        return local
      }

      function applyLoadedPosition(document, position) {
        const total = Number.isInteger(document.pages) && document.pages > 0 ? document.pages : 1
        const page = position === null ? 1 : Math.min(Math.max(1, position.page), total)
        const ratio = position === null ? 0 : position.ratio
        const nextZoom = position === null ? 1 : position.zoom
        savedPositionRef.current = position === null ? null : { ...position, page }
        positionRef.current = position === null
          ? null
          : { docId: document.id, page, ratio, zoom: nextZoom, at: Date.now() }
        setZoom(nextZoom)
        setPageInput(String(page))
        setCurrentPage(page)
        currentPageRef.current = page
      }

      function capturePosition() {
        const viewer = viewerRef.current
        const currentDocument = docRef.current
        if (viewer === null || currentDocument === null) return null
        const page = Math.min(Math.max(1, currentPageRef.current || 1), currentDocument.pages)
        let element = viewer.querySelector(`.dr-page[data-page="${page}"]`)
        if (element === null) element = viewer.querySelector('.dr-page[data-page]')
        if (element === null) return null
        const viewerRect = viewer.getBoundingClientRect()
        const rect = element.getBoundingClientRect()
        const pageTop = rect.top - viewerRect.top + viewer.scrollTop
        const ratio = rect.height > 0 ? Math.min(1, Math.max(0, (viewer.scrollTop - pageTop) / rect.height)) : 0
        return {
          page: Number(element.getAttribute('data-page')) || page,
          ratio,
          zoom: zoomRef.current,
          at: Date.now(),
        }
      }

      function sendHostPosition(position) {
        if (position === null || typeof position.docId !== 'string') return
        fetch(apiUrl('/position'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-dsh-deepread': '1',
          },
          body: JSON.stringify({
            docId: position.docId,
            page: position.page,
            ratio: position.ratio,
            zoom: position.zoom,
          }),
          keepalive: true,
        }).catch(() => {})
      }

      function persistPosition(position, host = true) {
        if (position === null) return
        writeLocalPosition(position.docId, position)
        if (host) sendHostPosition(position)
      }

      function schedulePositionSave() {
        const currentDocument = docRef.current
        if (currentDocument === null) return
        const snapshot = capturePosition()
        if (snapshot === null) return
        positionRef.current = { docId: currentDocument.id, ...snapshot }
        if (saveTimerRef.current === 0) {
          saveTimerRef.current = window.setTimeout(() => {
            saveTimerRef.current = 0
            const current = positionRef.current
            if (current !== null) writeLocalPosition(current.docId, current)
          }, 250)
        }
        if (hostTimerRef.current === 0) {
          hostTimerRef.current = window.setTimeout(() => {
            hostTimerRef.current = 0
            const current = positionRef.current
            if (current !== null) sendHostPosition(current)
          }, 900)
        }
      }

      function flushPosition() {
        const currentDocument = docRef.current
        if (currentDocument === null) return
        const snapshot = capturePosition()
        const position = snapshot === null
          ? positionRef.current
          : { docId: currentDocument.id, ...snapshot }
        if (position === null) return
        positionRef.current = position
        writeLocalPosition(position.docId, position)
        sendHostPosition(position)
      }

      function rememberPage(page, ratio = 0) {
        const currentDocument = docRef.current
        if (currentDocument === null) return
        const position = {
          docId: currentDocument.id,
          page,
          ratio,
          zoom: zoomRef.current,
          at: Date.now(),
        }
        positionRef.current = position
        currentPageRef.current = page
        persistPosition(position)
      }

      React.useEffect(() => {
        if (!sessionId) {
          setReference(null)
          setChatError('')
          return undefined
        }
        let retained = null
        try {
          retained = retainSession(sessionId)
        } catch (error) {
          setChatError(error instanceof Error ? error.message : String(error))
          setReference(null)
          return undefined
        }
        setChatError('')
        setReference(retained)
        return () => {
          setReference(null)
          try {
            retained.release()
          } catch {
            // The reference may already have been released by the session.
          }
        }
      }, [sessionId])

      React.useEffect(() => {
        if (toast === null) return undefined
        const timer = window.setTimeout(() => setToast(null), 3200)
        return () => window.clearTimeout(timer)
      }, [toast])

      React.useEffect(() => {
        const stored = safeGet('dsh.deepread.doc')
        if (stored === null || !/^[a-f0-9]{24}$/.test(stored)) return undefined
        let cancelled = false
        setBusy(tx('loading.opening'))
        Promise.all([
          fetch(apiUrl(`/doc/${stored}`)).then((response) => readJsonResponse(response)),
          loadStoredPosition(stored),
        ])
          .then(([value, position]) => {
            if (cancelled || !value) return
            applyLoadedPosition(value, position)
            setDoc(value)
          })
          .catch(() => {
            safeRemove('dsh.deepread.doc')
          })
          .finally(() => {
            if (!cancelled) setBusy('')
          })
        return () => { cancelled = true }
        // The stored document is restored once for this panel lifetime.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      React.useEffect(() => {
        if (doc === null) return undefined
        const query = searchQuery.trim()
        if (query === '') {
          setSearch(null)
          setSearchOpen(false)
          return undefined
        }
        const id = window.setTimeout(() => {
          const seq = searchSeq.current + 1
          searchSeq.current = seq
          setSearch({ query, loading: true, total: 0, pages: [], index: 0, error: null })
          fetch(apiUrl(`/search/${doc.id}?q=${encodeURIComponent(query)}`))
            .then((response) => readJsonResponse(response))
            .then((value) => {
              if (searchSeq.current !== seq) return
              const pages = Array.isArray(value.pages) ? value.pages : []
              setSearch({ query, loading: false, total: value.total ?? 0, pages, index: 0, error: null })
              // Show the hits without moving the reader: jumping while someone
              // is still typing yanks the page away from what they were reading.
              if (pages.length > 0 && document.activeElement === searchInputRef.current) setSearchOpen(true)
            })
            .catch((error) => {
              if (searchSeq.current !== seq) return
              setSearch({ query, loading: false, total: 0, pages: [], index: 0, error: error.message })
            })
        }, 380)
        return () => window.clearTimeout(id)
      }, [searchQuery, doc])

      React.useEffect(() => {
        if (doc === null) {
          setMarks([])
          setActiveMarkId(null)
          return undefined
        }
        let cancelled = false
        fetch(apiUrl(`/annotations/${doc.id}`))
          .then((response) => readJsonResponse(response))
          .then((value) => {
            if (!cancelled) setMarks(Array.isArray(value?.items) ? value.items : [])
          })
          .catch(() => {
            if (!cancelled) setMarks([])
          })
        return () => { cancelled = true }
      }, [doc])

      // A pointer outside the search cluster dismisses the hit list, the same
      // way a menu closes; the toggle button stays inside the cluster.
      React.useEffect(() => {
        if (!searchOpen) return undefined
        function onPointerDown(event) {
          const group = searchGroupRef.current
          if (group !== null && group.contains(event.target)) return
          setSearchOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        return () => document.removeEventListener('pointerdown', onPointerDown, true)
      }, [searchOpen])

      React.useEffect(() => {
        safeSet('dsh.deepread.source', source)
      }, [source])

      React.useEffect(() => {
        safeSet('dsh.deepread.webmode', webMode)
      }, [webMode])

      React.useEffect(() => {
        safeSet('dsh.deepread.webzoom', String(webZoom))
      }, [webZoom])

      React.useEffect(() => {
        if (source !== 'web' || webMode !== 'read' || webUrl === '') {
          setWebFind({ total: 0, index: 0 })
          return undefined
        }
        const timer = window.setTimeout(() => {
          setWebFind((current) => ({ ...current, index: 0 }))
          sendWebFind(webFindQuery, 0)
        }, 300)
        return () => window.clearTimeout(timer)
        // sendWebFind only reads the current frame and the query.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [webFindQuery, source, webMode, webUrl])

      /** The frame's layout box follows the pane, so zoom needs the pane size. */
      React.useEffect(() => {
        if (source !== 'web' || webUrl === '') return undefined
        const node = webZoomWrapRef.current
        if (node === null || typeof ResizeObserver === 'undefined') return undefined
        const measure = () => {
          setWebViewport((prev) => {
            const width = node.clientWidth
            const height = node.clientHeight
            return prev.width === width && prev.height === height ? prev : { width, height }
          })
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(node)
        return () => observer.disconnect()
      }, [source, webUrl])

      React.useEffect(() => {
        setWebAddress(webUrl)
        if (webUrl !== '') {
          try {
            safeSet('dsh.deepread.weburl', webUrl)
          } catch {
            // Storage is optional; the in-memory value still works.
          }
        }
      }, [webUrl])

      /**
       * The bridge in the proxied frame is the only channel out of the page.
       * It reports the selection, link activations, form searches and the
       * title; the reader turns a reported selection into the same selection
       * state the PDF word layer produces, so the bottom bar and Ask work
       * unchanged.
       */
      React.useEffect(() => {
        function onMessage(event) {
          const frame = webFrameRef.current
          if (frame === null || event.source !== frame.contentWindow) return
          const data = event.data
          if (data === null || typeof data !== 'object' || data.__dshDeepread !== 1) return
          if (data.kind === 'selection') {
            const text = typeof data.text === 'string' ? data.text : ''
            if (source !== 'web' || text === '') {
              setSelection(null)
              return
            }
            setSelection({
              text: text.slice(0, 12_000),
              source: 'web',
              url: webUrl,
              title: webTitle,
            })
          } else if (data.kind === 'navigate' && typeof data.url === 'string') {
            navigateWeb(data.url)
          } else if (data.kind === 'external' && typeof data.url === 'string') {
            void openWebExternal(data.url)
          } else if (data.kind === 'zoom') {
            const direction = data.direction === 1 ? 1 : -1
            setWebZoom((value) => Math.max(0.5, Math.min(2, Math.round((value + direction * 0.1) * 10) / 10)))
          } else if (data.kind === 'findResult') {
            const total = Number.isInteger(data.total) ? data.total : 0
            const index = Number.isInteger(data.index) ? data.index : 0
            setWebFind({ total, index })
          } else if (data.kind === 'ready') {
            setWebTitle(typeof data.title === 'string' ? data.title : '')
            setWebLoading(false)
            if (webFindQuery.trim() !== '') sendWebFind(webFindQuery, 0)
          } else if (data.kind === 'escape') {
            setSelection(null)
          }
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
      }, [source, webUrl, webTitle, webFindQuery])

      const errors = React.useMemo(() => {
        const list = []
        if (docError) list.push(docError)
        if (search?.error) list.push(tx('error.search', { message: search.error }))
        return list
      }, [docError, search, tx])

      const notify = React.useCallback((text, bad = false) => {
        setToast({ text, bad })
      }, [])

      function showError(text) {
        setToast({ text, bad: true })
      }

      /**
       * Collapsing is a deliberate layout choice, so it is the only thing that
       * writes the preference; the automatic reveal after "问 AI" stays
       * transient. Hiding the pane never disposes the conversation or the
       * terminal, which keep running behind it.
       */
      function setCollapsed(next) {
        setReaderOnly(next)
        try {
          safeSet('dsh.deepread.readeronly', next ? '1' : '0')
        } catch {
          // Storage is optional; the in-memory state still applies.
        }
        if (next) notify(tx('side.collapsed'))
      }

      function beginResize(event) {
        event.preventDefault()
        const element = rootRef.current
        if (element === null) return
        const bounds = element.getBoundingClientRect()
        const move = (moveEvent) => {
          const percent = ((moveEvent.clientX - bounds.left) / bounds.width) * 100
          setSplit(Math.min(78, Math.max(30, percent)))
        }
        const up = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
          dragRef.current = null
        }
        dragRef.current = move
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }

      React.useEffect(() => () => {
        if (dragRef.current !== null) {
          window.removeEventListener('pointermove', dragRef.current)
          dragRef.current = null
        }
      }, [])
      function beginSideResize(event) {
        event.preventDefault()
        const element = sideRef.current
        if (element === null) return
        const bounds = element.getBoundingClientRect()
        const move = (moveEvent) => {
          const percent = ((moveEvent.clientY - bounds.top) / bounds.height) * 100
          setSideSplit(Math.min(75, Math.max(28, percent)))
        }
        const up = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
          sideDragRef.current = null
        }
        sideDragRef.current = move
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }

      function toggleTocNode(id) {
        setExpanded((current) => {
          const next = new Set(current)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }

      function expandAllToc() {
        setExpanded(collectOutlineIds(outlineTree, () => true))
      }

      function collapseAllToc() {
        setExpanded(new Set())
      }

      React.useEffect(() => {
        safeSet('dsh.deepread.split', String(Math.round(split)))
      }, [split])

      React.useEffect(() => {
        safeSet('dsh.deepread.sidemode', sideMode)
      }, [sideMode])

      React.useEffect(() => {
        safeSet('dsh.deepread.sidesplit', String(Math.round(sideSplit)))
      }, [sideSplit])

      React.useEffect(() => {
        safeSet('dsh.deepread.toc', tocOpen ? '1' : '0')
      }, [tocOpen])

      React.useEffect(() => {
        if (sideMode !== 'chat') setTermEnabled(true)
      }, [sideMode])


      React.useEffect(() => {
        if (doc === null) {
          setOutline({ state: 'idle', rows: [], error: '' })
          return undefined
        }
        let cancelled = false
        setOutline({ state: 'loading', rows: [], error: '' })
        fetch(apiUrl(`/outline/${doc.id}`))
          .then((response) => readJsonResponse(response))
          .then((value) => {
            if (cancelled) return
            const rows = Array.isArray(value?.outline) ? value.outline : []
            setOutline({ state: 'ready', rows, error: typeof value?.error === 'string' ? value.error : '' })
            const tree = buildOutlineTree(rows)
            setExpanded(collectOutlineIds(tree, (node) => node.children.length > 0 && node.depth < 1))
          })
          .catch((error) => {
            if (!cancelled) setOutline({ state: 'error', rows: [], error: error instanceof Error ? error.message : String(error) })
          })
        return () => { cancelled = true }
        // The outline belongs to the document id; object identity changes on reload.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [doc?.id])

      React.useEffect(() => {
        const viewer = viewerRef.current
        if (viewer === null || doc === null || typeof IntersectionObserver !== 'function') return undefined
        const pages = viewer.querySelectorAll('.dr-page[data-page]')
        const observer = new IntersectionObserver((entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => Number(entry.target.getAttribute('data-page')))
            .filter((page) => Number.isInteger(page) && page > 0)
          if (visible.length === 0) return
          const first = Math.min(...visible)
          currentPageRef.current = first
          setCurrentPage(first)
          const input = pageInputRef.current
          if (input !== null && document.activeElement !== input) setPageInput(String(first))
        }, { root: viewer, rootMargin: '0px 0px -55% 0px', threshold: 0 })
        pages.forEach((page) => observer.observe(page))
        return () => observer.disconnect()
      }, [doc])

      React.useEffect(() => () => {
        if (sideDragRef.current !== null) {
          window.removeEventListener('pointermove', sideDragRef.current)
          sideDragRef.current = null
        }
      }, [])

      React.useLayoutEffect(() => {
        if (doc === null) return undefined
        const viewer = viewerRef.current
        if (viewer === null) return undefined
        const saved = savedPositionRef.current
        if (saved === null) {
          viewer.scrollTop = 0
          return undefined
        }
        const total = Number.isInteger(doc.pages) && doc.pages > 0 ? doc.pages : 1
        const page = Math.min(Math.max(1, saved.page), total)
        const element = viewer.querySelector(`.dr-page[data-page="${page}"]`)
        if (element === null) return undefined
        const viewerRect = viewer.getBoundingClientRect()
        const rect = element.getBoundingClientRect()
        const pageTop = rect.top - viewerRect.top + viewer.scrollTop
        viewer.scrollTop = Math.max(0, pageTop + (saved.ratio ?? 0) * rect.height)
        positionRef.current = {
          docId: doc.id,
          page,
          ratio: saved.ratio ?? 0,
          zoom: zoomRef.current,
          at: Date.now(),
        }
        return undefined
        // Restore once per document; user scrolling takes over afterwards.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [doc?.id])

      React.useEffect(() => {
        zoomRef.current = zoom
        const currentDocument = docRef.current
        if (currentDocument === null) return undefined
        const snapshot = capturePosition()
        if (snapshot === null) return undefined
        const position = { docId: currentDocument.id, ...snapshot, zoom, at: Date.now() }
        positionRef.current = position
        writeLocalPosition(position.docId, position)
        sendHostPosition(position)
        return undefined
      }, [zoom])

      React.useEffect(() => () => {
        if (saveTimerRef.current !== 0) {
          window.clearTimeout(saveTimerRef.current)
          saveTimerRef.current = 0
        }
        if (hostTimerRef.current !== 0) {
          window.clearTimeout(hostTimerRef.current)
          hostTimerRef.current = 0
        }
        flushPosition()
      }, [])

      React.useEffect(() => {
        const onHide = () => {
          if (document.visibilityState === 'hidden') flushPosition()
        }
        document.addEventListener('visibilitychange', onHide)
        window.addEventListener('pagehide', onHide)
        return () => {
          document.removeEventListener('visibilitychange', onHide)
          window.removeEventListener('pagehide', onHide)
        }
        // The flush reads live refs; it does not need to re-register per position.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      const outlineTree = React.useMemo(() => buildOutlineTree(outline.rows), [outline.rows])
      const tocTree = React.useMemo(() => filterOutline(outlineTree, tocFilter), [outlineTree, tocFilter])
      const activeOutlineId = React.useMemo(() => {
        let best = null
        const visit = (nodes) => {
          for (const node of nodes) {
            if (node.page > 0 && node.page <= currentPage && (best === null || node.page >= best.page)) best = node
            visit(node.children)
          }
        }
        visit(outlineTree)
        return best === null ? undefined : best.id
      }, [outlineTree, currentPage])

      // Capture native copies from the PDF text layer; the ClipboardEvent may
      // target the document rather than the section, so this lives on document.
      React.useEffect(() => {
        const onCopy = (event) => {
          if (event.defaultPrevented) return
          const target = event.target
          if (target instanceof Element && target.closest('input, textarea, [contenteditable="true"]') !== null) return
          const text = readSelection(viewerRef.current)
          if (text === '') return
          event.preventDefault()
          if (event.clipboardData !== null) event.clipboardData.setData('text/plain', text)
          setSelection({ text })
          setWeb((current) => (
            current === null || !current.open
              ? { open: true, query: text.slice(0, 300), state: 'idle', result: null, error: '' }
              : current
          ))
          notify(tx('toast.copied'))
        }
        document.addEventListener('copy', onCopy)
        return () => document.removeEventListener('copy', onCopy)
      }, [tx])

      function goToPage(number) {
        const viewer = viewerRef.current
        if (viewer === null) return
        const page = Math.min(Math.max(1, Number(number) || 1), doc === null ? 1 : doc.pages)
        const element = viewer.querySelector(`.dr-page[data-page="${page}"]`)
        if (element !== null) element.scrollIntoView({ block: 'start', behavior: 'smooth' })
        setPageInput(String(page))
        setCurrentPage(page)
        rememberPage(page, 0)
      }

      /**
       * Turn the current selection into per-page normalized boxes: each hit
       * word keeps its rectangle relative to its own page, so a highlight
       * survives zoom and resolution changes.
       * @returns one { page, boxes } entry per page the selection touches.
       */
      function selectionBoxes() {
        const container = viewerRef.current
        if (container === null) return []
        const windowSelection = window.getSelection()
        if (windowSelection === null || windowSelection.rangeCount === 0 || windowSelection.isCollapsed) return []
        const range = windowSelection.getRangeAt(0)
        const byPage = new Map()
        // Only the pages the range touches: walking every word of a long book
        // is what made highlighting slow.
        for (const pageElement of container.querySelectorAll('.dr-page')) {
          let inPage = false
          try {
            inPage = range.intersectsNode(pageElement)
          } catch {
            inPage = false
          }
          if (!inPage) continue
          const pageRect = pageElement.getBoundingClientRect()
          if (pageRect.width <= 0 || pageRect.height <= 0) continue
          for (const word of pageElement.querySelectorAll('.dr-word')) {
            const page = Number(word.dataset.page)
            if (!Number.isInteger(page) || page < 1) continue
            const wordRect = word.getBoundingClientRect()
            if (wordRect.width <= 0 || wordRect.height <= 0) continue
            const entry = byPage.get(page) ?? { page, boxes: [] }
            if (entry.boxes.length >= 400) continue
            entry.boxes.push({
              x: Math.max(0, Math.min(1, (wordRect.left - pageRect.left) / pageRect.width)),
              y: Math.max(0, Math.min(1, (wordRect.top - pageRect.top) / pageRect.height)),
              w: Math.max(0.001, Math.min(1, wordRect.width / pageRect.width)),
              h: Math.max(0.001, Math.min(1, wordRect.height / pageRect.height)),
            })
            byPage.set(page, entry)
          }
        }
        return [...byPage.values()]
      }

      function newMarkId() {
        try {
          if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
        } catch {
          // Fall through to a timestamp id.
        }
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
      }

      async function refreshDocuments() {
        setDocsBusy(true)
        try {
          const value = await fetch(apiUrl('/documents')).then((response) => readJsonResponse(response))
          setDocs(Array.isArray(value?.items) ? value.items : [])
        } catch {
          setDocs([])
        } finally {
          setDocsBusy(false)
        }
      }

      async function openDocumentById(id) {
        if (!/^[a-f0-9]{24}$/.test(id)) return
        setBusy(tx('loading.opening'))
        try {
          const [value, position] = await Promise.all([
            fetch(apiUrl(`/doc/${id}`)).then((response) => readJsonResponse(response)),
            loadStoredPosition(id),
          ])
          if (!value || typeof value.id !== 'string') throw new Error('document not found')
          applyLoadedPosition(value, position)
          setDoc(value)
          safeSet('dsh.deepread.doc', value.id)
          setSource('pdf')
          setSearchQuery('')
          setSearch(null)
          setSelection(null)
          setActiveMarkId(null)
          setDocsOpen(false)
        } catch (error) {
          showError(tx('error.docOpen', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setBusy('')
        }
      }

      async function removeDocument(id) {
        if (doc !== null && doc.id === id) {
          setDoc(null)
          setMarks([])
          setActiveMarkId(null)
          safeRemove('dsh.deepread.doc')
        }
        setDocsBusy(true)
        try {
          await postJson('/documents/remove', { id })
          await refreshDocuments()
        } catch (error) {
          showError(tx('error.docOpen', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setDocsBusy(false)
        }
      }

      function requestRemoveDocument(id) {
        if (pendingRemoveId === id) {
          setPendingRemoveId(null)
          void removeDocument(id)
          return
        }
        setPendingRemoveId(id)
        window.setTimeout(() => {
          setPendingRemoveId((current) => (current === id ? null : current))
        }, 3000)
      }

      async function addMark() {
        if (doc === null || selection === null || source !== 'pdf') return
        const groups = selectionBoxes()
        if (groups.length === 0) return
        setNotesBusy(true)
        try {
          let items = marks
          for (const group of groups.slice(0, 8)) {
            const item = {
              id: newMarkId(),
              page: group.page,
              boxes: group.boxes,
              text: (selection.text || '').slice(0, 4000),
              note: '',
              color: markColor,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
            const value = await postJson('/annotations', { docId: doc.id, op: 'add', item })
            if (Array.isArray(value?.items)) items = value.items
          }
          setMarks(items)
          setSelection(null)
          const windowSelection = window.getSelection()
          if (windowSelection !== null) windowSelection.removeAllRanges()
          notify(tx('toast.highlighted'))
        } catch (error) {
          showError(tx('error.mark', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setNotesBusy(false)
        }
      }

      async function saveNote() {
        if (doc === null || activeMarkId === null) return
        setNotesBusy(true)
        try {
          const value = await postJson('/annotations', {
            docId: doc.id,
            op: 'update',
            id: activeMarkId,
            patch: { note: noteDraft, color: markColor },
          })
          if (Array.isArray(value?.items)) setMarks(value.items)
          setActiveMarkId(null)
          notify(tx('toast.markSaved'))
        } catch (error) {
          showError(tx('error.mark', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setNotesBusy(false)
        }
      }

      async function deleteMark(id) {
        if (doc === null) return
        setNotesBusy(true)
        try {
          const value = await postJson('/annotations', { docId: doc.id, op: 'remove', id })
          if (Array.isArray(value?.items)) setMarks(value.items)
          if (activeMarkId === id) setActiveMarkId(null)
        } catch (error) {
          showError(tx('error.mark', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setNotesBusy(false)
        }
      }

      const marksByPage = React.useMemo(() => {
        const map = new Map()
        for (const mark of marks) {
          if (mark === null || typeof mark !== 'object' || !Number.isInteger(mark.page)) continue
          const list = map.get(mark.page) ?? []
          list.push(mark)
          map.set(mark.page, list)
        }
        return map
      }, [marks])

      const activeMark = React.useMemo(
        () => marks.find((mark) => mark.id === activeMarkId) ?? null,
        [marks, activeMarkId],
      )

      function cycleMatch(direction) {
        if (search === null || !Array.isArray(search.pages) || search.pages.length === 0) return
        const next = (search.index + direction + search.pages.length) % search.pages.length
        setSearch({ ...search, index: next })
        goToPage(search.pages[next].page)
      }

      function sendWebFind(query, index) {
        const frame = webFrameRef.current
        if (frame === null || frame.contentWindow === null) return
        frame.contentWindow.postMessage({ __dshDeepreadCmd: 1, kind: 'find', query, index }, '*')
      }

      function cycleWebFind(direction) {
        if (webFind.total <= 0) return
        const next = (webFind.index + direction + webFind.total) % webFind.total
        setWebFind((current) => ({ ...current, index: next }))
        sendWebFind(webFindQuery, next)
      }

      async function openFile(file) {
        if (!(file instanceof File)) return
        if (file.type !== '' && file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
          showError(tx('error.notPdf'))
          return
        }
        setDocError('')
        flushPosition()
        setBusy(tx('loading.uploading', { name: file.name }))
        try {
          const response = await fetch(apiUrl('/open'), {
            method: 'POST',
            headers: {
              'content-type': 'application/pdf',
              'x-dsh-deepread': '1',
              'x-deepread-filename': encodeURIComponent(file.name),
            },
            body: file,
          })
          const value = await readJsonResponse(response)
          if (!value || typeof value.id !== 'string') throw new Error('the Host returned no document')
          const position = await loadStoredPosition(value.id)
          safeSet('dsh.deepread.doc', value.id)
          applyLoadedPosition(value, position)
          setDoc(value)
          setSearchQuery('')
          setSearch(null)
          setSelection(null)
          setWeb(null)
          notify(tx('toast.opened'))
        } catch (error) {
          setDocError(tx('error.upload', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setBusy('')
          if (fileRef.current) fileRef.current.value = ''
        }
      }

      function captureSelection() {
        window.setTimeout(() => {
          const text = readSelection(viewerRef.current)
          setSelection(text === '' ? null : { text })
        }, 0)
      }

      function copySelection(text) {
        const value = text ?? selection?.text ?? ''
        if (value === '') return
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(value).then(
            () => notify(tx('toast.copied')),
            () => showError(tx('selection.copyFailed')),
          )
        } else {
          showError(tx('selection.copyFailed'))
        }
      }

      async function runWebSearch(query) {
        const value = (query ?? web?.query ?? selection?.text ?? '').trim()
        if (value === '') return
        setWeb({ open: true, query: value, state: 'loading', result: null, error: '' })
        try {
          const result = await postJson('/websearch', { query: value.slice(0, 400) })
          setWeb({ open: true, query: value, state: 'done', result, error: '' })
        } catch (error) {
          setWeb({ open: true, query: value, state: 'error', result: null, error: error instanceof Error ? error.message : String(error) })
        }
      }

      function openWebFromSelection() {
        if (selection === null) return
        setWeb({ open: true, query: selection.text.slice(0, 300), state: 'idle', result: null, error: '' })
        runWebSearch(selection.text.slice(0, 300))
      }

      function pushWebUrl(url) {
        // Re-opening the address already shown has to reload it; pushing the
        // same entry changes nothing and would leave the loading overlay up.
        if (webUrl === url) {
          reloadWeb()
          return
        }
        setWebNav((prev) => {
          const entries = prev.entries.slice(0, prev.index + 1)
          if (entries[entries.length - 1] === url) return { entries, index: entries.length - 1 }
          entries.push(url)
          const trimmed = entries.slice(-40)
          return { entries: trimmed, index: trimmed.length - 1 }
        })
        setWebTitle('')
        setSelection(null)
        setWebLoading(true)
      }

      function goWeb(input) {
        const address = normalizeAddress(input)
        if (address === null) {
          showError(tx('error.address'))
          return
        }
        if (address === '') {
          setWebNav({ entries: [], index: 0 })
          setWebTitle('')
          setSelection(null)
          return
        }
        pushWebUrl(address)
      }

      /** A link in the proxied page navigates the reader, never the frame. */
      function navigateWeb(url) {
        const address = normalizeAddress(url)
        if (address === null || address === '') return
        pushWebUrl(address)
      }

      function webBack() {
        setSelection(null)
        setWebLoading(true)
        setWebNav((prev) => (prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev))
      }

      function webForward() {
        setSelection(null)
        setWebLoading(true)
        setWebNav((prev) => (prev.index < prev.entries.length - 1 ? { ...prev, index: prev.index + 1 } : prev))
      }

      function reloadWeb() {
        if (webUrl === '') return
        setWebLoading(true)
        setWebNonce((value) => value + 1)
      }

      async function openWebExternal(url) {
        if (typeof url !== 'string' || url === '') return
        try {
          await postJson('/open-page', { url })
        } catch (error) {
          showError(tx('error.open', { message: error instanceof Error ? error.message : String(error) }))
        }
      }

      async function askSelection(text, question) {
        const value = (text ?? selection?.text ?? '').trim().slice(0, 12_000)
        if (value === '') return
        if (!sessionId) {
          showError(tx('error.noSession'))
          return
        }
        // Asking is a conversation act: make the answer visible. That means
        // revealing a collapsed right pane and leaving terminal-only mode,
        // where the conversation area is hidden.
        if (readerOnly) setReaderOnly(false)
        if (sideMode === 'terminal') setSideMode('chat')
        setAsking(true)
        try {
          const payload = { sessionId, text: value, question: question ?? '' }
          if (selection !== null && selection.source === 'web') {
            payload.source = 'web'
            payload.url = selection.url
            payload.title = selection.title
          }
          await postJson('/ask', payload)
          notify(tx('selection.asked'))
          setWeb(null)
        } catch (error) {
          showError(tx('error.ask', { message: error instanceof Error ? error.message : String(error) }))
        } finally {
          setAsking(false)
        }
      }

      const webFrameStyle = webViewport.width > 0 && webViewport.height > 0
        ? {
          width: `${Math.ceil(webViewport.width / webZoom)}px`,
          height: `${Math.ceil(webViewport.height / webZoom)}px`,
          transform: `scale(${webZoom})`,
        }
        : { width: '100%', height: '100%' }

      const selectedText = selection?.text ?? ''
      const hasSession = typeof sessionId === 'string' && sessionId !== ''
      const sessionCwd = hasSession ? sessionsById?.[sessionId]?.cwd : undefined

      return h('div', {
        ref: rootRef,
        className: 'dr-root',
        style: { '--dr-zoom': String(zoom) },
      }, [
        h(StyleTag, { key: 'style' }),
        h('div', { key: 'topbar', ref: topbarRef, className: 'dr-topbar', 'data-window-drag': '' }, [
          h('div', {
            key: 'brand',
            className: 'dr-brand',
            style: trafficInset === 0 ? undefined : { marginLeft: trafficInset },
          }, [h(BookIcon, { key: 'i', size: 16 }), tx('panel.label')]),
          h('div', {
            key: 'source',
            className: 'dr-mode-switch dr-source-switch',
            'data-window-drag-recall': '',
            role: 'group',
            'aria-label': tx('source.label'),
          }, [
            h('button', {
              key: 'pdf',
              type: 'button',
              className: 'dr-mode-btn',
              'data-on': source === 'pdf' ? '1' : '0',
              'aria-pressed': source === 'pdf',
              onClick: () => setSource('pdf'),
            }, tx('source.pdf')),
            h('button', {
              key: 'web',
              type: 'button',
              className: 'dr-mode-btn',
              'data-on': source === 'web' ? '1' : '0',
              'aria-pressed': source === 'web',
              onClick: () => setSource('web'),
            }, tx('source.web')),
          ]),
          source === 'pdf' && doc !== null && h('button', {
            key: 'open',
            type: 'button',
            className: 'dr-btn dr-icon dr-icon-btn dr-tip',
            'data-window-drag-recall': '',
            'data-tip': `${tx('toolbar.replace')} · ${doc.name}`,
            'aria-label': `${tx('toolbar.replace')} ${doc.name}`,
            onClick: () => fileRef.current?.click(),
            disabled: Boolean(busy),
          }, h(OpenIcon, { key: 'i' })),
          h('input', {
            key: 'file',
            ref: fileRef,
            type: 'file',
            accept: 'application/pdf,.pdf',
            style: { display: 'none' },
            onChange: (event) => {
              const file = event.target.files?.[0]
              if (file) openFile(file)
            },
          }),
          source === 'web' && h('form', {
            key: 'address',
            style: { display: 'contents' },
            'data-window-drag-recall': '',
            onSubmit: (event) => {
              event.preventDefault()
              goWeb(webAddress)
            },
          }, [
            h('input', {
              key: 'input',
              className: 'dr-input dr-address-input',
              type: 'text',
              inputMode: 'url',
              autoComplete: 'off',
              spellCheck: false,
              placeholder: tx('page.address'),
              'aria-label': tx('page.address'),
              value: webAddress,
              onChange: (event) => setWebAddress(event.target.value),
            }),
            h('button', {
              key: 'go',
              type: 'button',
              className: 'dr-btn dr-icon',
              title: tx('page.go'),
              'aria-label': tx('page.go'),
              onClick: () => goWeb(webAddress),
            }, h(GlobeIcon, {})),
          ]),
          h('div', { key: 'actions', className: 'dr-head-actions', 'data-window-drag-recall': '' }, [
            source === 'web' && h('div', { key: 'webnav', className: 'dr-group' }, [
              h('button', {
                key: 'back',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('page.back'),
                'aria-label': tx('page.back'),
                disabled: webNav.index <= 0,
                onClick: webBack,
              }, h(ChevronIcon, { direction: 'left' })),
              h('button', {
                key: 'forward',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('page.forward'),
                'aria-label': tx('page.forward'),
                disabled: webNav.index >= webNav.entries.length - 1,
                onClick: webForward,
              }, h(ChevronIcon, { direction: 'right' })),
              h('button', {
                key: 'reload',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('page.reload'),
                'aria-label': tx('page.reload'),
                disabled: webUrl === '',
                onClick: reloadWeb,
              }, h(ReloadIcon, {})),
              !webTight && h('div', {
                key: 'mode',
                className: 'dr-mode-switch',
                role: 'group',
                'aria-label': tx('source.label'),
              }, [
                h('button', {
                  key: 'read',
                  type: 'button',
                  className: 'dr-mode-btn',
                  'data-on': webMode === 'read' ? '1' : '0',
                  'aria-pressed': webMode === 'read',
                  title: tx('page.readerHint'),
                  onClick: () => setWebMode('read'),
                }, tx('page.reader')),
                h('button', {
                  key: 'direct',
                  type: 'button',
                  className: 'dr-mode-btn',
                  'data-on': webMode === 'direct' ? '1' : '0',
                  'aria-pressed': webMode === 'direct',
                  title: tx('page.originalHint'),
                  onClick: () => setWebMode('direct'),
                }, tx('page.original')),
              ]),
              !webTight && h('button', {
                key: 'external',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('page.external'),
                'aria-label': tx('page.external'),
                disabled: webUrl === '',
                onClick: () => { void openWebExternal(webUrl) },
              }, h(ExternalIcon, {})),
            ]),
            source === 'web' && h('div', { key: 'webzoom', className: 'dr-group' }, [
              h('button', {
                key: 'out',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('page.zoomOut'),
                'aria-label': tx('page.zoomOut'),
                onClick: () => setWebZoom((value) => Math.max(0.5, Math.round((value - 0.1) * 10) / 10)),
              }, h(MinusIcon, {})),
              h('button', {
                key: 'pct',
                type: 'button',
                className: 'dr-btn',
                title: tx('page.zoomReset'),
                onClick: () => setWebZoom(1),
                style: { minWidth: 48, fontVariantNumeric: 'tabular-nums' },
              }, `${Math.round(webZoom * 100)}%`),
              h('button', {
                key: 'in',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('page.zoomIn'),
                'aria-label': tx('page.zoomIn'),
                onClick: () => setWebZoom((value) => Math.min(2, Math.round((value + 0.1) * 10) / 10)),
              }, h(PlusIcon, {})),
            ]),
            source === 'web' && webMode === 'read' && webUrl !== '' && h('div', { key: 'webfind', className: 'dr-group' }, [
              h('div', { key: 'wrap', style: { position: 'relative', display: 'inline-flex', alignItems: 'center' } }, [
                h(SearchIcon, { size: 14, key: 'icon', style: { position: 'absolute', left: 8, color: 'var(--dsw-alias-label-secondary)', pointerEvents: 'none' } }),
                h('input', {
                  key: 'input',
                  className: 'dr-input dr-search-input',
                  value: webFindQuery,
                  placeholder: tx('webfind.placeholder'),
                  'aria-label': tx('webfind.placeholder'),
                  style: { paddingLeft: 27 },
                  onChange: (event) => setWebFindQuery(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      cycleWebFind(event.shiftKey ? -1 : 1)
                    }
                    if (event.key === 'Escape') {
                      setWebFindQuery('')
                      sendWebFind('', 0)
                    }
                  },
                }),
              ]),
              webFindQuery.trim() !== '' && h('span', { key: 'count', className: 'dr-match-count' }, webFind.total > 0 ? tx('toolbar.matches', { count: webFind.total }) : tx('toolbar.noMatches')),
              webFind.total > 0 && h('button', {
                key: 'prev',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('toolbar.previous'),
                'aria-label': tx('toolbar.previous'),
                onClick: () => cycleWebFind(-1),
              }, h(ChevronIcon, { direction: 'up' })),
              webFind.total > 0 && h('button', {
                key: 'next',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('toolbar.next'),
                'aria-label': tx('toolbar.next'),
                onClick: () => cycleWebFind(1),
              }, h(ChevronIcon, { direction: 'down' })),
            ]),
            source === 'pdf' && doc !== null && h('div', { key: 'pager', className: 'dr-group', 'data-window-drag-recall': '' }, [
              h('input', {
                key: 'page',
                ref: pageInputRef,
                className: 'dr-input dr-page-input',
                value: pageInput,
                inputMode: 'numeric',
                'aria-label': tx('toolbar.page'),
                onChange: (event) => setPageInput(event.target.value.replace(/[^0-9]/g, '')),
                onKeyDown: (event) => {
                  if (event.key === 'Enter') goToPage(pageInput)
                },
                onBlur: () => goToPage(pageInput),
              }),
              h('span', { key: 'of', className: 'dr-match-count' }, `${tx('toolbar.of')} ${doc.pages}`),
            ]),
            source === 'pdf' && doc !== null && h('div', { key: 'zoom', className: 'dr-group', 'data-window-drag-recall': '' }, [
              h('button', {
                key: 'out',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('toolbar.zoomOut'),
                'aria-label': tx('toolbar.zoomOut'),
                onClick: () => setZoom((value) => Math.max(0.6, Math.round((value - 0.1) * 10) / 10)),
              }, h(MinusIcon, {})),
              h('button', {
                key: 'pct',
                type: 'button',
                className: 'dr-btn',
                title: tx('toolbar.fit'),
                onClick: () => setZoom(1),
                style: { minWidth: 48, fontVariantNumeric: 'tabular-nums' },
              }, `${Math.round(zoom * 100)}%`),
              h('button', {
                key: 'in',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('toolbar.zoomIn'),
                'aria-label': tx('toolbar.zoomIn'),
                onClick: () => setZoom((value) => Math.min(2.4, Math.round((value + 0.1) * 10) / 10)),
              }, h(PlusIcon, {})),
            ]),
            source === 'pdf' && doc !== null && h('div', { key: 'search', ref: searchGroupRef, className: 'dr-group dr-search-group', 'data-window-drag-recall': '' }, [
              h('div', { key: 'wrap', style: { position: 'relative', display: 'inline-flex', alignItems: 'center' } }, [
                h(SearchIcon, { size: 14, key: 'icon', style: { position: 'absolute', left: 8, color: 'var(--dsw-alias-label-secondary)', pointerEvents: 'none' } }),
                h('input', {
                  key: 'input',
                  ref: searchInputRef,
                  className: 'dr-input dr-search-input',
                  value: searchQuery,
                  placeholder: tx('toolbar.find'),
                  'aria-label': tx('toolbar.find'),
                  style: { paddingLeft: 27 },
                  onChange: (event) => setSearchQuery(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      if (search?.pages?.length) cycleMatch(event.shiftKey ? -1 : 1)
                      else if (doc !== null) goToPage(1)
                    }
                    if (event.key === 'Escape') {
                      if (searchOpen) setSearchOpen(false)
                      else setSearchQuery('')
                    }
                  },
                }),
              ]),
              search !== null && !search.loading && (search.pages.length > 0
                ? h('button', {
                  key: 'count',
                  type: 'button',
                  className: 'dr-match-count dr-count-btn',
                  title: tx('toolbar.results'),
                  'aria-label': tx('toolbar.results'),
                  'aria-expanded': searchOpen,
                  onClick: () => setSearchOpen((value) => !value),
                }, tx('toolbar.matches', { count: search.total }))
                : h('span', { key: 'count', className: 'dr-match-count' }, tx('toolbar.noMatches'))),
              search !== null && search.pages.length > 0 && h('button', {
                key: 'prev',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('toolbar.previous'),
                'aria-label': tx('toolbar.previous'),
                onClick: () => cycleMatch(-1),
              }, h(ChevronIcon, { direction: 'up' })),
              search !== null && search.pages.length > 0 && h('button', {
                key: 'next',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('toolbar.next'),
                'aria-label': tx('toolbar.next'),
                onClick: () => cycleMatch(1),
              }, h(ChevronIcon, { direction: 'down' })),
              searchOpen && search !== null && !search.loading && search.pages.length > 0 && h('div', {
                key: 'results',
                className: 'dr-search-results',
                role: 'listbox',
                'aria-label': tx('toolbar.results'),
              }, search.pages.slice(0, 40).map((row, index) => h('button', {
                key: `${row.page}-${index}`,
                type: 'button',
                role: 'option',
                'aria-selected': index === search.index,
                className: `dr-search-result${index === search.index ? ' dr-active' : ''}`,
                onClick: () => {
                  setSearch((current) => (current === null ? current : { ...current, index }))
                  goToPage(row.page)
                  setSearchOpen(false)
                },
              }, [
                h('span', { key: 'p', className: 'dr-result-page' }, String(row.page)),
                h('span', { key: 's', className: 'dr-result-snippet' }, typeof row.snippet === 'string' ? row.snippet : ''),
                h('span', { key: 'c', className: 'dr-result-count' }, String(row.count ?? '')),
              ]))),
            ]),
            !tightBar && source === 'pdf' && doc !== null && h('button', {
              key: 'toc',
              type: 'button',
              className: 'dr-btn dr-icon dr-icon-btn dr-tip',
              'data-tip': outline.state === 'ready' && outline.rows.length > 0
                ? `${tx('toc.title')} · ${outline.rows.length}`
                : tx('toc.title'),
              'aria-label': tx('toc.title'),
              'aria-expanded': tocOpen,
              onClick: () => setTocOpen((value) => {
                const next = !value
                if (next) {
                  setNotesOpen(false)
                  setDocsOpen(false)
                }
                return next
              }),
              style: tocOpen
                ? { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)' }
                : undefined,
            }, [
              h(TocIcon, { key: 'i' }),
              outline.state === 'loading' && h('span', { key: 's', className: 'dr-icon-spinner' }),
              outline.state === 'ready' && outline.rows.length > 0 && h('span', { key: 'n', className: 'dr-count-badge' }, String(outline.rows.length)),
            ]),
            !tightBar && source === 'pdf' && doc !== null && h('button', {
              key: 'notes',
              type: 'button',
              className: 'dr-btn dr-icon dr-icon-btn dr-tip',
              'data-tip': marks.length > 0 ? `${tx('notes.open')} · ${marks.length}` : tx('notes.open'),
              'aria-label': tx('notes.open'),
              'aria-expanded': notesOpen,
              onClick: () => setNotesOpen((value) => {
                const next = !value
                if (next) {
                  setTocOpen(false)
                  setDocsOpen(false)
                }
                return next
              }),
              style: notesOpen
                ? { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)' }
                : undefined,
            }, [
              h(MarkerIcon, { key: 'i' }),
              marks.length > 0 && h('span', { key: 'n', className: 'dr-count-badge' }, String(marks.length)),
            ]),
            !tightBar && h('button', {
              key: 'docs',
              type: 'button',
              className: 'dr-btn dr-icon dr-icon-btn dr-tip',
              'data-tip': tx('docs.open'),
              'aria-label': tx('docs.open'),
              'aria-expanded': docsOpen,
              onClick: () => {
                setDocsOpen((value) => {
                  if (!value) {
                    void refreshDocuments()
                    setTocOpen(false)
                    setNotesOpen(false)
                  }
                  return !value
                })
              },
              style: docsOpen
                ? { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)' }
                : undefined,
            }, [h(StackIcon, { key: 'i' })]),
            !compactBar && !collapsed && h('span', { key: 'sep-side', className: 'dr-sep' }),
            !compactBar && !collapsed && h('div', {
              key: 'side-mode',
              className: 'dr-mode-switch',
              role: 'group',
              'aria-label': tx('side.mode'),
            }, [
              ['split', tx('side.split')],
              ['chat', tx('side.chat')],
              ['terminal', tx('side.terminal')],
            ].map(([mode, label]) => h('button', {
              key: mode,
              type: 'button',
              className: 'dr-mode-btn',
              'data-on': sideMode === mode ? '1' : undefined,
              'aria-pressed': sideMode === mode,
              onClick: () => {
                setSideMode(mode)
                if (mode !== 'chat') setTermEnabled(true)
              },
            }, label))),
            !compactBar && !collapsed && Array.isArray(sessionIds) && sessionIds.length > 0 && h('select', {
              key: 'side-session',
              className: 'dr-input dr-session-select',
              value: pickedSession,
              title: tx('chat.pick'),
              'aria-label': tx('chat.pick'),
              onChange: (event) => chooseSession(event.target.value),
            }, [
              h('option', { key: 'auto', value: '' }, tx('chat.follow')),
              ...sessionIds.map((id) => h('option', { key: id, value: id },
                String(sessionsById?.[id]?.title || id).slice(0, 80))),
            ]),
            !compactBar && !collapsed && h('span', {
              key: 'side-pill',
              className: `dr-session-pill${hasSession ? '' : ' dr-off'}`,
            }, hasSession ? tx('chat.live') : tx('chat.none')),
            !compactBar && !collapsed && hasSession && h('button', {
              key: 'conversation',
              type: 'button',
              className: 'dr-btn dr-icon dr-icon-btn dr-tip',
              'data-tip': tx('chat.open'),
              'aria-label': tx('chat.open'),
              onClick: () => selectConversation(),
            }, h(PageIcon, {})),
            hasContent && h('button', {
              key: 'reader',
              type: 'button',
              className: 'dr-btn dr-icon dr-icon-btn dr-tip',
              'data-tip': collapsed ? tx('side.expand') : tx('side.collapse'),
              'aria-label': collapsed ? tx('side.expand') : tx('side.collapse'),
              onClick: () => setCollapsed(!collapsed),
            }, h(ChevronIcon, { key: 'i', direction: collapsed ? 'left' : 'right' })),

            compactBar && h('div', { key: 'more-wrap', ref: moreWrapRef, className: 'dr-more-wrap' }, [
              h('button', {
                key: 'more-btn',
                type: 'button',
                className: 'dr-btn dr-icon dr-icon-btn dr-tip',
                'data-tip': tx('more.open'),
                'aria-label': tx('more.open'),
                'aria-haspopup': 'menu',
                'aria-expanded': moreOpen,
                onClick: () => setMoreOpen((value) => !value),
                style: moreOpen
                  ? { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)' }
                  : undefined,
              }, h(MoreIcon, {})),
              moreOpen && h('div', { key: 'more-menu', className: 'dr-more', role: 'menu' }, [
                source === 'web' && webTight && h('button', {
                  key: 'web-read',
                  type: 'button',
                  role: 'menuitemradio',
                  'aria-checked': webMode === 'read',
                  className: 'dr-more-row',
                  onClick: () => {
                    setWebMode('read')
                    setMoreOpen(false)
                  },
                }, [
                  h(BookIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('page.reader')),
                  webMode === 'read' && h('span', { key: 'c', className: 'dr-more-check' }, '✓'),
                ]),
                source === 'web' && webTight && h('button', {
                  key: 'web-direct',
                  type: 'button',
                  role: 'menuitemradio',
                  'aria-checked': webMode === 'direct',
                  className: 'dr-more-row',
                  onClick: () => {
                    setWebMode('direct')
                    setMoreOpen(false)
                  },
                }, [
                  h(GlobeIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('page.original')),
                  webMode === 'direct' && h('span', { key: 'c', className: 'dr-more-check' }, '✓'),
                ]),
                source === 'web' && webTight && h('button', {
                  key: 'web-external',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dr-more-row',
                  disabled: webUrl === '',
                  onClick: () => {
                    void openWebExternal(webUrl)
                    setMoreOpen(false)
                  },
                }, [
                  h(ExternalIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('page.external')),
                ]),
                source === 'web' && webTight && h('div', { key: 'sep-web', className: 'dr-more-sep' }),
                tightBar && h('button', {
                  key: 'toc',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dr-more-row',
                  onClick: () => {
                    setTocOpen(true)
                    setNotesOpen(false)
                    setDocsOpen(false)
                    setMoreOpen(false)
                  },
                }, [
                  h(TocIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('toc.open')),
                  outline.state === 'ready' && outline.rows.length > 0 && h('span', { key: 'n', className: 'dr-more-count' }, String(outline.rows.length)),
                ]),
                tightBar && h('button', {
                  key: 'notes',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dr-more-row',
                  onClick: () => {
                    setNotesOpen(true)
                    setTocOpen(false)
                    setDocsOpen(false)
                    setMoreOpen(false)
                  },
                }, [
                  h(MarkerIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('notes.open')),
                  marks.length > 0 && h('span', { key: 'n', className: 'dr-more-count' }, String(marks.length)),
                ]),
                tightBar && h('button', {
                  key: 'docs',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dr-more-row',
                  onClick: () => {
                    void refreshDocuments()
                    setDocsOpen(true)
                    setTocOpen(false)
                    setNotesOpen(false)
                    setMoreOpen(false)
                  },
                }, [
                  h(StackIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('docs.open')),
                ]),
                tightBar && !collapsed && h('div', { key: 'sep-a', className: 'dr-more-sep' }),
                !collapsed && h('div', { key: 'mode', className: 'dr-more-block' }, [
                  h('span', { key: 'label', className: 'dr-more-label' }, tx('side.mode')),
                  h('div', { key: 'switch', className: 'dr-mode-switch' }, [
                    ['split', tx('side.split')],
                    ['chat', tx('side.chat')],
                    ['terminal', tx('side.terminal')],
                  ].map(([mode, label]) => h('button', {
                    key: mode,
                    type: 'button',
                    className: 'dr-mode-btn',
                    'data-on': sideMode === mode ? '1' : undefined,
                    'aria-pressed': sideMode === mode,
                    onClick: () => {
                      setSideMode(mode)
                      if (mode !== 'chat') setTermEnabled(true)
                    },
                  }, label))),
                ]),
                !collapsed && Array.isArray(sessionIds) && sessionIds.length > 0 && h('div', { key: 'session', className: 'dr-more-block' }, [
                  h('span', { key: 'label', className: 'dr-more-label' }, tx('chat.pick')),
                  h('select', {
                    key: 'select',
                    className: 'dr-input dr-session-select dr-more-select',
                    value: pickedSession,
                    onChange: (event) => chooseSession(event.target.value),
                  }, [
                    h('option', { key: 'auto', value: '' }, tx('chat.follow')),
                    ...sessionIds.map((id) => h('option', { key: id, value: id },
                      String(sessionsById?.[id]?.title || id).slice(0, 80))),
                  ]),
                ]),
                !collapsed && h('div', { key: 'status', className: 'dr-more-block' }, [
                  h('span', {
                    key: 'pill',
                    className: `dr-session-pill${hasSession ? '' : ' dr-off'}`,
                  }, hasSession ? tx('chat.live') : tx('chat.none')),
                ]),
                !collapsed && hasSession && h('button', {
                  key: 'conversation',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dr-more-row',
                  onClick: () => {
                    selectConversation()
                    setMoreOpen(false)
                  },
                }, [
                  h(PageIcon, { key: 'i' }),
                  h('span', { key: 'l', className: 'dr-more-text' }, tx('chat.open')),
                ]),
              ]),
            ]),
          ]),
        ]),

        errors.length > 0 && h('div', { key: 'errors', className: 'dr-error-line' }, errors.join(' · ')),
        h('div', { key: 'split', className: `dr-split${collapsed ? ' dr-reader-only' : ''}` }, [
          h('section', {
            key: 'pane',
            className: 'dr-pdf-pane',
            style: collapsed ? { flex: '1 1 auto' } : { flex: `0 0 ${split}%` },
          }, [
            source === 'web'
              ? h('div', { key: 'webview', className: 'dr-webview' },
                webUrl === ''
                  ? h('div', { className: 'dr-empty' }, [
                    h(GlobeIcon, { key: 'i', size: 38 }),
                    h('h3', { key: 't' }, tx('page.emptyTitle')),
                    h('p', { key: 'b' }, tx('page.emptyBody')),
                    h('small', { key: 'h' }, tx('page.emptyHint')),
                  ])
                  : h(React.Fragment, null, [
                    h('div', { key: 'zoomwrap', ref: webZoomWrapRef, className: 'dr-zoom-wrap' },
                      h('iframe', {
                        key: `webframe-${webNonce}-${webMode}`,
                        ref: webFrameRef,
                        className: 'dr-webframe',
                        style: webFrameStyle,
                        src: webMode === 'read'
                          ? `${apiUrl('/page')}?url=${encodeURIComponent(webUrl)}&n=${webNonce}`
                          : webUrl,
                        title: webTitle === '' ? tx('page.untitled') : webTitle,
                        sandbox: webMode === 'read'
                          ? 'allow-scripts allow-forms'
                          : 'allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox',
                        referrerPolicy: 'no-referrer',
                        onLoad: () => setWebLoading(false),
                      })),
                    webMode === 'direct' && h('div', { key: 'note', className: 'dr-webview-note' }, [
                      h('span', { key: 'text' }, tx('page.directNote')),
                      h('button', {
                        key: 'switch',
                        type: 'button',
                        className: 'dr-btn dr-primary',
                        onClick: () => setWebMode('read'),
                      }, tx('page.switchReader')),
                    ]),
                    webLoading && h('div', { key: 'loading', className: 'dr-webview-loading' }, [
                      h('span', { key: 's', className: 'dr-spinner' }),
                      tx('page.loading'),
                    ]),
                  ]))
              : h('div', {
                key: 'viewer',
                ref: viewerRef,
                className: 'dr-viewer',
                onMouseUp: captureSelection,
                onKeyUp: captureSelection,
                onScroll: schedulePositionSave,
              }, doc === null
                ? h('div', { className: 'dr-empty' }, [
                  h(BookIcon, { key: 'i', size: 38 }),
                  h('h3', { key: 't' }, tx('empty.title')),
                  h('p', { key: 'b' }, tx('empty.body')),
                  h('div', { key: 'actions', className: 'dr-empty-actions' }, [
                    h('button', {
                      key: 'pdf',
                      type: 'button',
                      className: 'dr-btn dr-primary',
                      onClick: () => fileRef.current?.click(),
                      disabled: Boolean(busy),
                    }, [h(OpenIcon, { key: 'i' }), tx('empty.action')]),
                    h('button', {
                      key: 'web',
                      type: 'button',
                      className: 'dr-btn',
                      onClick: () => setSource('web'),
                    }, [h(GlobeIcon, { key: 'i' }), tx('empty.web')]),
                  ]),
                  h('small', { key: 'h' }, tx('empty.hint')),
                ])
                : (Array.isArray(doc.texts) ? doc.texts : []).map((page, index) => h(PageView, {
                  imageDpi,
                  key: `${doc.id}-${index + 1}`,
                  docId: doc.id,
                  pageNumber: index + 1,
                  page,
                  highlight: search?.query ?? '',
                  marks: marksByPage.get(index + 1) ?? EMPTY_MARKS,
                }))),
            busy !== '' && h('div', {
              key: 'busy',
              style: doc === null
                ? {
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 8,
                  justifyContent: 'center', padding: '8px 12px', background: 'var(--dsw-alias-bg-base)',
                  fontSize: 12, color: 'var(--dsw-alias-label-secondary)', zIndex: 10,
                }
                : {
                  position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', gap: 8,
                  justifyContent: 'center', padding: '8px 12px', background: 'var(--dsw-alias-bg-overlay)',
                  borderBottom: '1px solid var(--dsw-alias-border-l1)', fontSize: 12, color: 'var(--dsw-alias-label-secondary)', zIndex: 10,
                },
            }, [h('span', { key: 's', className: 'dr-spinner' }), busy]),
            web !== null && web.open && h('div', { key: 'web', className: 'dr-web-card' }, [
              h('div', { key: 'head', className: 'dr-web-head' }, [
                h('input', {
                  key: 'input',
                  className: 'dr-input',
                  value: web.query,
                  placeholder: tx('web.placeholder'),
                  'aria-label': tx('web.placeholder'),
                  onChange: (event) => setWeb({ ...web, query: event.target.value }),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      runWebSearch(web.query)
                    }
                  },
                }),
                h('button', {
                  key: 'run',
                  type: 'button',
                  className: 'dr-btn dr-icon',
                  title: tx('web.run'),
                  'aria-label': tx('web.run'),
                  onClick: () => runWebSearch(web.query),
                  disabled: web.state === 'loading',
                }, h(SearchIcon, {})),
                h('button', {
                  key: 'close',
                  type: 'button',
                  className: 'dr-btn dr-icon',
                  title: tx('web.title'),
                  'aria-label': tx('web.title'),
                  onClick: () => setWeb(null),
                }, h(CloseIcon, {})),
              ]),
              h('div', { key: 'body', className: 'dr-web-body' },
                web.state === 'loading'
                  ? h('div', { className: 'dr-web-note' }, [h('span', { key: 's', className: 'dr-spinner' }), '  ', tx('web.loading')])
                  : web.state === 'error'
                    ? h('div', { className: 'dr-web-note' }, tx('error.web', { message: web.error }))
                    : web.state === 'idle'
                      ? h('div', { className: 'dr-web-note' }, tx('selection.count', { count: selectedText.length }))
                      : (web.result?.sources?.length ?? 0) === 0
                        ? h('div', { className: 'dr-web-note' }, tx('web.empty'))
                        : h(React.Fragment, null, [
                          web.result?.content && h('div', { key: 'summary', className: 'dr-web-note' }, String(web.result.content).slice(0, 700)),
                          ...(web.result?.sources ?? []).map((source, index) => h('a', {
                            key: `source-${index}`,
                            className: 'dr-web-item',
                            href: source.url,
                            target: '_blank',
                            rel: 'noreferrer',
                          }, [
                            h('span', { key: 't', className: 'dr-web-title' }, source.title || source.url),
                            h('span', { key: 'u', className: 'dr-web-url' }, source.url),
                            source.snippet && h('span', { key: 's', className: 'dr-web-snippet' }, source.snippet),
                          ])),
                        ]),
              ),
              h('div', { key: 'foot', className: 'dr-web-foot' }, [
                selectedText !== '' && h('button', {
                  key: 'ask',
                  type: 'button',
                  className: 'dr-btn',
                  onClick: () => askSelection(selectedText),
                  disabled: asking || !hasSession,
                  title: hasSession ? tx('web.ask') : tx('error.noSession'),
                }, [h(SparkIcon, { key: 'i' }), tx('web.ask')]),
              ]),
            ]),
            selection !== null && h('div', { key: 'selection', className: 'dr-selection' }, [
              h('span', { key: 'text', className: 'dr-selection-text', title: selectedText },
                h('b', null, tx('selection.count', { count: selectedText.length })), ' · ', selectedText.replace(/\s+/g, ' ').slice(0, 90)),
              h('button', {
                key: 'copy',
                type: 'button',
                className: 'dr-btn',
                onClick: () => copySelection(),
              }, [h(CopyIcon, { key: 'i' }), tx('selection.copy')]),
              h('button', {
                key: 'mark',
                type: 'button',
                className: 'dr-btn',
                onClick: () => { void addMark() },
                disabled: notesBusy || source !== 'pdf',
              }, [h(MarkerIcon, { key: 'i' }), tx('selection.highlight')]),
              h('button', {
                key: 'search',
                type: 'button',
                className: 'dr-btn',
                onClick: openWebFromSelection,
              }, [h(SearchIcon, { key: 'i' }), tx('selection.search')]),
              h('button', {
                key: 'ask',
                type: 'button',
                className: 'dr-btn dr-primary',
                onClick: () => askSelection(selectedText),
                disabled: asking || !hasSession,
                title: hasSession ? tx('selection.ask') : tx('error.noSession'),
              }, [h(SparkIcon, { key: 'i' }), tx('selection.ask')]),
              h('button', {
                key: 'close',
                type: 'button',
                className: 'dr-btn dr-icon',
                title: tx('selection.close'),
                'aria-label': tx('selection.close'),
                onClick: () => setSelection(null),
              }, h(CloseIcon, {})),
            ]),
            docsOpen && h('div', {
              key: 'documents',
              className: 'dr-toc dr-docs',
              onKeyDown: (event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation()
                  setDocsOpen(false)
                }
              },
            }, [
              h('div', { key: 'head', className: 'dr-toc-head' }, [
                h('span', { key: 'title', className: 'dr-toc-title' }, tx('docs.title')),
                docs.length > 0 && h('span', { key: 'count', className: 'dr-toc-count' }, String(docs.length)),
                h('button', {
                  key: 'close',
                  type: 'button',
                  className: 'dr-btn dr-icon',
                  title: tx('notes.close'),
                  'aria-label': tx('notes.close'),
                  onClick: () => setDocsOpen(false),
                }, h(CloseIcon, {})),
              ]),
              h('div', { key: 'body', className: 'dr-toc-body' },
                docsBusy
                  ? h('div', { key: 'busy', className: 'dr-toc-note' }, h('span', { className: 'dr-spinner' }))
                  : docs.length === 0
                    ? h('p', { key: 'empty', className: 'dr-toc-note' }, tx('docs.empty'))
                    : docs.map((row) => h('div', {
                      key: row.id,
                      className: `dr-doc-row${doc !== null && doc.id === row.id ? ' dr-active' : ''}`,
                    }, [
                      h('button', {
                        key: 'open',
                        type: 'button',
                        className: 'dr-doc-open',
                        title: row.name,
                        onClick: () => { void openDocumentById(row.id) },
                      }, [
                        h('span', { key: 't', className: 'dr-doc-title' }, row.title || row.name),
                        h('span', { key: 'm', className: 'dr-doc-meta' }, `${tx('docs.pages', { count: row.pages })} · ${row.name}`),
                      ]),
                      h('button', {
                        key: 'del',
                        type: 'button',
                        className: `dr-btn dr-note-action${pendingRemoveId === row.id ? ' dr-bad' : ''}`,
                        'aria-label': tx('docs.remove'),
                        onClick: () => requestRemoveDocument(row.id),
                      }, pendingRemoveId === row.id ? tx('docs.confirm') : tx('docs.remove')),
                    ]))),
            ]),
            notesOpen && source === 'pdf' && doc !== null && h('div', {
              key: 'notes',
              className: 'dr-toc dr-notes',
              onKeyDown: (event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation()
                  setNotesOpen(false)
                  setActiveMarkId(null)
                }
              },
            }, [
              h('div', { key: 'head', className: 'dr-toc-head' }, [
                h('span', { key: 'title', className: 'dr-toc-title' }, tx('notes.title')),
                marks.length > 0 && h('span', { key: 'count', className: 'dr-toc-count' }, tx('notes.count', { count: marks.length })),
                h('button', {
                  key: 'close',
                  type: 'button',
                  className: 'dr-btn dr-icon',
                  title: tx('notes.close'),
                  'aria-label': tx('notes.close'),
                  onClick: () => { setNotesOpen(false); setActiveMarkId(null) },
                }, h(CloseIcon, {})),
              ]),
              h('div', { key: 'body', className: 'dr-toc-body' },
                marks.length === 0
                  ? h('p', { key: 'empty', className: 'dr-toc-note' }, tx('notes.empty'))
                  : marks.map((mark) => h('div', {
                    key: mark.id,
                    className: `dr-note-row${activeMarkId === mark.id ? ' dr-active' : ''}`,
                  }, [
                    h('button', {
                      key: 'jump',
                      type: 'button',
                      className: 'dr-note-jump',
                      title: tx('notes.jump', { page: mark.page }),
                      onClick: () => goToPage(mark.page),
                    }, [
                      h('span', { key: 'p', className: 'dr-note-page' }, `p.${mark.page}`),
                      h('span', { key: 't', className: 'dr-note-text' }, typeof mark.text === 'string' ? mark.text : ''),
                    ]),
                    h('span', { key: 'dot', className: 'dr-note-dot', 'data-color': mark.color, 'aria-hidden': true }),
                    h('button', {
                      key: 'note',
                      type: 'button',
                      className: 'dr-btn dr-note-action',
                      onClick: () => {
                        setActiveMarkId(mark.id)
                        setNoteDraft(typeof mark.note === 'string' ? mark.note : '')
                        setMarkColor(mark.color || 'yellow')
                      },
                    }, tx('notes.edit')),
                    h('button', {
                      key: 'del',
                      type: 'button',
                      className: 'dr-btn dr-note-action',
                      onClick: () => { void deleteMark(mark.id) },
                    }, tx('notes.delete')),
                  ]))),
              activeMark !== null && h('div', { key: 'editor', className: 'dr-note-editor' }, [
                h('div', { key: 'colors', className: 'dr-note-colors', role: 'group', 'aria-label': tx('notes.colour') },
                  ['yellow', 'green', 'blue', 'pink', 'purple'].map((color) => h('button', {
                    key: color,
                    type: 'button',
                    className: `dr-note-swatch${markColor === color ? ' dr-active' : ''}`,
                    'data-color': color,
                    title: color,
                    'aria-label': color,
                    onClick: () => setMarkColor(color),
                  }))),
                h('textarea', {
                  key: 'text',
                  className: 'dr-input dr-note-input',
                  value: noteDraft,
                  placeholder: tx('notes.placeholder'),
                  rows: 3,
                  onChange: (event) => setNoteDraft(event.target.value),
                }),
                h('div', { key: 'actions', className: 'dr-note-actions' }, [
                  h('button', {
                    key: 'save',
                    type: 'button',
                    className: 'dr-btn dr-primary',
                    disabled: notesBusy,
                    onClick: () => { void saveNote() },
                  }, tx('notes.save')),
                  h('button', {
                    key: 'del',
                    type: 'button',
                    className: 'dr-btn',
                    disabled: notesBusy,
                    onClick: () => { void deleteMark(activeMark.id) },
                  }, tx('notes.delete')),
                  h('button', {
                    key: 'close',
                    type: 'button',
                    className: 'dr-btn',
                    onClick: () => setActiveMarkId(null),
                  }, tx('notes.close')),
                ]),
              ]),
            ]),
            tocOpen && source === 'pdf' && doc !== null && h('div', {
              key: 'toc',
              className: 'dr-toc',
              onKeyDown: (event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation()
                  setTocOpen(false)
                }
              },
            }, [
              h('div', { key: 'head', className: 'dr-toc-head' }, [
                h('span', { key: 'title', className: 'dr-toc-title' }, tx('toc.title')),
                outline.state === 'ready' && h('span', { key: 'count', className: 'dr-toc-count' }, tx('toc.count', { count: outline.rows.length })),
                h('button', {
                  key: 'close',
                  type: 'button',
                  className: 'dr-btn dr-icon',
                  title: tx('toc.title'),
                  'aria-label': tx('toc.title'),
                  onClick: () => setTocOpen(false),
                }, h(CloseIcon, {})),
              ]),
              h('div', { key: 'filter', className: 'dr-toc-filter' },
                h('input', {
                  className: 'dr-input',
                  value: tocFilter,
                  placeholder: tx('toc.filter'),
                  'aria-label': tx('toc.filter'),
                  onChange: (event) => setTocFilter(event.target.value),
                }),
              ),
              h('div', { key: 'actions', className: 'dr-toc-actions' }, [
                h('button', {
                  key: 'expand',
                  type: 'button',
                  className: 'dr-btn',
                  onClick: expandAllToc,
                  disabled: outline.state !== 'ready' || outline.rows.length === 0,
                }, tx('toc.expand')),
                h('button', {
                  key: 'collapse',
                  type: 'button',
                  className: 'dr-btn',
                  onClick: collapseAllToc,
                  disabled: outline.state !== 'ready' || outline.rows.length === 0,
                }, tx('toc.collapse')),
              ]),
              h('div', { key: 'body', className: 'dr-toc-body' },
                outline.state === 'loading'
                  ? h('div', { className: 'dr-toc-note' }, [
                    h('span', { key: 's', className: 'dr-spinner' }),
                    ' ',
                    tx('toc.loading'),
                  ])
                  : outline.state === 'error'
                    ? h('div', { className: 'dr-toc-note' }, tx('toc.error', { message: outline.error }))
                    : outline.rows.length === 0
                      ? h('div', { className: 'dr-toc-note' }, outline.error !== '' ? tx('toc.error', { message: outline.error }) : tx('toc.empty'))
                      : tocTree.length === 0
                        ? h('div', { className: 'dr-toc-note' }, tx('toc.noMatch'))
                        : tocTree.map((node) => h(OutlineNode, {
                          key: node.id,
                          node,
                          depth: 0,
                          expanded,
                          onToggle: toggleTocNode,
                          onJump: goToPage,
                          activeId: activeOutlineId,
                          forceOpen: tocFilter.trim() !== '',
                        })),
              ),
            ]),
          ]),
          !collapsed && h('div', {
            key: 'divider',
            className: 'dr-divider',
            role: 'separator',
            'aria-orientation': 'vertical',
            'aria-valuenow': Math.round(split),
            tabIndex: 0,
            onPointerDown: beginResize,
            onKeyDown: (event) => {
              if (event.key === 'ArrowLeft') setSplit((value) => Math.max(30, value - 2))
              if (event.key === 'ArrowRight') setSplit((value) => Math.min(78, value + 2))
            },
          }),
          h('section', {
            key: 'chat',
            ref: rightPaneRef,
            className: 'dr-chat-pane',
            'aria-hidden': collapsed ? true : undefined,
            style: collapsed ? { display: 'none' } : undefined,
          }, [
            h('div', { key: 'body', className: 'dr-side-body', ref: sideRef }, [
              h('div', {
                key: 'chatslot',
                className: 'dr-chat-slot',
                style: sideMode === 'split'
                  ? { flex: `0 0 ${sideSplit}%` }
                  : sideMode === 'chat'
                    ? { flex: '1 1 auto' }
                    : { display: 'none' },
              }, [
                h('div', { key: 'chatbody', className: 'dr-chat-body' },
                  chatError !== ''
                    ? h('div', { className: 'dr-chat-empty' }, [
                      h('h3', { key: 't' }, tx('chat.emptyTitle')),
                      h('p', { key: 'b' }, chatError),
                    ])
                    : hasSession && reference !== null && SessionProvider !== undefined
                      ? h(ChatBoundary, { key: `boundary-${sessionId}`, title: tx('chat.emptyTitle'), body: tx('chat.emptyBody') },
                        h(SessionProvider, {
                          session: reference,
                          empty: () => h('div', { className: 'dr-chat-empty' }, [
                            h('span', { key: 's', className: 'dr-spinner' }),
                            h('p', { key: 'p' }, tx('loading.opening')),
                          ]),
                        }, renderSlot('deepread.chat', {})))
                      : h('div', { className: 'dr-chat-empty' }, [
                        h('h3', { key: 't' }, tx('chat.emptyTitle')),
                        h('p', { key: 'b' }, tx('chat.emptyBody')),
                        h('small', { key: 'h' }, tx('chat.restore')),
                        hasSession
                          ? null
                          : h('button', {
                            key: 'new',
                            type: 'button',
                            className: 'dr-btn dr-primary',
                            onClick: () => startSession(),
                          }, tx('chat.new')),
                      ]),
                ),
              ]),
              sideMode === 'split' && h('div', {
                key: 'sidedivider',
                className: 'dr-side-divider',
                role: 'separator',
                'aria-orientation': 'horizontal',
                'aria-valuenow': Math.round(sideSplit),
                tabIndex: 0,
                onPointerDown: beginSideResize,
                onKeyDown: (event) => {
                  if (event.key === 'ArrowUp') setSideSplit((value) => Math.max(28, value - 2))
                  if (event.key === 'ArrowDown') setSideSplit((value) => Math.min(75, value + 2))
                },
              }),
              termEnabled && h('div', {
                key: 'termslot',
                ref: terminalSlotRef,
                className: 'dr-term-slot',
                style: sideMode === 'chat' ? { display: 'none' } : undefined,
              },
              terminalRuntime !== undefined
                ? h(ChatBoundary, {
                  key: `term-boundary-${sessionId ?? 'none'}`,
                  title: tx('term.title'),
                  body: tx('term.unavailable', { message: 'render failed' }),
                }, h(TerminalHost, {
                  key: `term-${sessionId ?? 'none'}`,
                  runtime: terminalRuntime,
                  sessionId,
                  cwd: sessionCwd,
                  tx,
                  visible: sideMode !== 'chat' && !collapsed,
                }))
                : h('div', { className: 'dr-term-empty' }, [
                  h('h3', { key: 't' }, tx('term.title')),
                  h('p', { key: 'b' }, tx('term.unavailable', { message: 'the terminal plugin is not enabled' })),
                ])
              ),
            ]),
          ]),
        ]),
        toast !== null && h('div', {
          key: 'toast',
          className: `dr-toast${toast.bad ? ' dr-bad' : ''}`,
          role: 'status',
        }, toast.text),
      ])
    }

    function ChatSlot(props) {
      return h(ChatPane, props)
    }

    // ---------------------------------------------------------------------
    // Plugin body
    // ---------------------------------------------------------------------
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'deepread: dictionaries')
      const t = ctx.locale.bind(NS)
      const currentSession = ctx.uiSession.adapter.current

      const retainSession = (sessionId) => ctx.sessions.retain(sessionId, { source: 'deepRead' })

      const TERMINAL_ID = '@deepseek-ai/dsh-client-ui-sidebar-terminal'
      const terminalTheme = {
        getSnapshot: () => ctx.theme.getTheme(),
        subscribe: (listener) => ctx.on('theme/change', listener),
      }
      let terminalBodyPromise

      const terminalRuntime = {
        theme: terminalTheme,
        t: ctx.locale.bind('sidebarTerminal'),
        /**
         * A view for this pane alone. The terminal controller saves the
         * content-to-terminal association, so a later view with the same
         * content identity reattaches to the same Host process instead of
         * allocating a new one. Nothing here creates a sidebar tab, and plugin
         * disposal only detaches: the controller keeps the process and closes
         * it through its own reclamation or an explicit close.
         */
        viewStandalone: (sessionId, contentId) => {
          const service = ctx.get('webTerminals')
          if (service === undefined) throw new Error('the built-in terminal plugin is not enabled')
          return service.view(sessionId, contentId, contentId)
        },
        closeStandalone: (sessionId, contentId, terminalId) => {
          const service = ctx.get('webTerminals')
          if (service === undefined) return
          service.close(sessionId, contentId, contentId, terminalId)
        },
        load: () => {
          if (terminalBodyPromise === undefined) {
            const modules = ctx.get('modules')
            if (modules === undefined) {
              return Promise.reject(new Error('the client module system is unavailable'))
            }
            terminalBodyPromise = modules.importChunk(TERMINAL_ID, 'client.terminal.js').then((chunk) => {
              if (typeof chunk?.TerminalBody !== 'function') throw new Error('the terminal body is unavailable')
              return chunk.TerminalBody
            }).catch((error) => {
              terminalBodyPromise = undefined
              throw error
            })
          }
          return terminalBodyPromise
        },
      }

      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: 'deepread',
        locale: NS,
        children: {
          'deepread.chat': { kind: 'single', scope: 'session' },
        },
        inject: () => ({
          hooks: { currentSession },
          retainSession,
          startSession: () => ctx.uiWorkspace.startSession(),
          selectConversation: () => ctx.layout.selectPanel('conversation'),
          terminalRuntime,
        }),
      }, ReaderPage))

      ctx.slots.inject('deepread.chat', () => ctx.slots.register({
        name: 'deepread.chat',
        locale: NS,
      }, ChatSlot))

      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: 'deepread',
        order: 20,
        locale: NS,
        label: () => t('panel.label'),
        inject: () => ({
          hooks: { currentSession, panelInfo: ctx.layout.panelInfo },
          retainMain: (sessionId) => ctx.sessions.retain(sessionId, { source: 'mainView' }),
        }),
      }, DeepReadIcon))
    }

    return {
      inject: ['slots', 'locale', 'layout', 'uiSession', 'sessions', 'uiWorkspace', 'theme'],
      apply,
    }
  },
})