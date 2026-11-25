# 深读 / DeepRead

深读在侧栏加一个入口，点开左边是 PDF 或者网页，右边就是你正在用的这个会话。工具栏顶上的「PDF / 网页」开关只管左边读什么，右边的对话、终端和底部那条选区栏都照旧。

## 安装

Plugins → Add plugin 里填：

```
@pemako/dsh-deepread
```

想固定版本就在名字后面加 `@版本号`。装好以后侧栏会多一个「深读」。PDF 是本机 Poppler（`pdfinfo`、`pdftotext`、`pdftoppm`）解析的，用之前先把它装好。

## 依赖

读 PDF 需要本机装有 Poppler 的 `pdfinfo`、`pdftotext`、`pdftoppm`：macOS 用 `brew install poppler`，Debian/Ubuntu 用 `apt install poppler-utils`，Windows 用 `scoop install poppler`。桌面端启动时可能看不到 Homebrew 的安装路径，所以插件会先查常见目录、再退回 `PATH`；也可以用 `DEEPREAD_POPPLER_DIR` 指定目录。Poppler 是系统程序而不是 npm 包，没法作为依赖自动装上。

书签目录走系统的 PDFKit（通过 `osascript`），这一项只在 macOS 上可用；其它平台面板里会说明，其余功能照常。

## 上手

点侧栏的「深读」（在 Plugins、Schedules 后面）。读 PDF 就点「选择 PDF」选一个本地文件，文件会传到 Host，由 Poppler 转成页面图片和带坐标的文字层。读网页直接在地址栏敲地址，裸域名按 https，`localhost:3000` 这种按 http；旁边的前进、后退、刷新和「用系统浏览器打开」都作用在当前这一页上。

中间的分隔条可以拖，左右比例随你；窗口窄的时候两边会改成上下堆。

在 PDF 或者网页上选中文字，底部会冒出同一条选区栏。「复制」按文字层重新拼纯文本，中文不会在字间插空格；「搜索」在 PDF 里打开网页搜索卡片，复制的时候也会顺手打开并填好内容；「问 AI」把选段当成一条普通用户消息发到右边的真实会话，网页模式下还会带上页面标题和地址，由当前 Agent 回答。

选中的内容也可以留下来。挑个颜色点「高亮」，这段文字就会在页面上留着标记，每条高亮还能写笔记。点工具栏的高亮图标会按页列出它们，可以跳过去、改颜色、写或改笔记、删掉。数据存在 Host 上跟文档放在一起，重启和换电脑都还在。

工具栏左边是阅读控件（页码、缩放、查找），右边是动作图标：目录、高亮、文档、右栏布局、会话选择和打开对话。查找会把命中的页列成一张单子，每行带一小段原文，点一下就跳过去；打字的过程中页面不会再自己乱跳。放大时页面会按更高的分辨率重新渲染，字不会糊。目录图标把 PDF 书签展开成一棵树，能过滤、能点章节跳转，当前页会标出来。图标把鼠标放上去会显示名字；窗口不够宽时，放不下的部分会收进最右边的「更多」菜单。

工具栏的文档图标会列出已经存下的文档，最近打开的排在前面，可以直接切换，也可以连同它的高亮一起删掉。

网页模式多了缩放：`−`、百分比、`+`，范围 0.5 到 2，点百分比回到 100%，或者在阅读模式里用 ⌘/Ctrl 加滚轮。它是先改 iframe 的布局宽度再整体缩放，所以文字会重新排版，跟浏览器缩放一个感觉，不是把页面当图片放大。缩放值会记住。

## 右边这一半

右边默认上下分：上面是会话，下面是终端，终端跑在会话的工作区里，跟着面板大小变。顶部工具栏里的三档开关可以切成「分栏」「只看对话」「只看终端」。切走或者收起右栏时终端的视图会断开，进程还在，回来接的还是同一个。

工具栏最右边的收起图标能把整块右栏收起，让 PDF 占满面板。收起的只是界面，终端进程和会话状态都还在，收起时会提示一次「会话和终端仍在后台运行」。展开回到收起前的分栏和比例。没打开 PDF 的时候这个按钮不出现，因为那时候没有要加宽的阅读区。选中文字点「问 AI」会临时把右栏拉出来并切到对话，就算原本是「只看终端」也能看到回答，这次自动展开不会改掉你存下的收起偏好。

终端是深读自己的一个视图，用 `ctx.get('webTerminals').view(sessionId, contentId, contentId)` 创建，contentId 形如 `deepread-terminal-<generation>`，generation 按会话存在 localStorage 里。它不会在会话右侧栏新建 terminal tab，所以切会话的时候右栏不会被撑开，也不会莫名其妙多出一个终端。字体和主题跟着 DSH 的设置走。面板挂着的时候视图持有终端；离开深读再回来，同一个 contentId 会接回原来的 Host 进程（进程还在的话），进程没了就显示「不可用 + 新终端」，点「新终端」会换一个 generation，先把旧的关掉。

深读现在不再开 iTerm 窗口了，打开 iTerm 的按钮、窗口对齐和依赖的 AppleScript 都已经拿掉。

右边的会话默认跟着当前会话走。如果切全局面板把当前会话弄丢了，聊天栏上有会话下拉框可以手动选。PDF 会留着，再点「深读」就自动重新打开。

## 阅读位置

页码、页内比例和缩放会按文档记住。切去便签墙或者别的面板、关掉再打开，都会回到上次的位置。位置同时写进 Host 的 `positions.json` 和浏览器 localStorage，Host 那份管跨重启，localStorage 那份让面板切换时的恢复快一点。

## 读网页

阅读模式（默认）会把页面通过 Host 的 `/dsh-deepread/api/page` 代理一次：去掉原站的 `X-Frame-Options` 和 CSP，注入 `<base>` 让原站的 CSS、图片和脚本还是从原站加载，再注入选区桥 `/dsh-deepread/api/bridge.js`。代理出来的文档带着 `Content-Security-Policy: sandbox`，就算单独打开也碰不到应用自己的源。面板只收桥报上来的东西：选中的文字、链接、GET 表单搜索和标题。划完词还是底部那条选区栏，复制、搜索、问 AI 都能用。

原站模式是把页面原样塞进 sandbox iframe，适合那些依赖自身源的页面。这种模式没有选区桥，所以划词提问用不了，面板里会说明并给一个切回阅读模式的入口。

阅读模式还能在页面里找字：查找框会数出命中数量，在页面上标出来，并且可以逐个跳过去，不用离开阅读区。

页面里的链接和 GET 搜索表单会回传给面板重新代理，iframe 不会自己跑到别的站去。POST 表单和 Cmd/Ctrl+点击交给系统浏览器。单页上限 12 MB。网页地址、来源、阅读/原站模式和网页缩放各自记住，PDF 和它的阅读位置单独存。

## 代码结构

`index.js` 是 Host 半部：PDF 上传和存储、Poppler 解析、页面图片缓存、文档搜索、`ctx.web.search` 代理、PDFKit 书签读取（`osascript` 加 `text/outline.jxa`）、网页代理和选区桥、用系统浏览器打开，以及把选段投递给 `ctx.agents.get(sessionId).followup()`。

`client.js` 是浏览器半部：`sidebar.panellist` 入口、`main` 面板、可拖的左右/上下分栏、PDF 图片和文字层、目录树、复制/搜索/提问、PDF 和网页的来源切换、网页工具栏和桥消息、右栏整块收起（`dsh.deepread.readeronly`），还有通过 `conversation.content` Factory 渲染的真实会话。终端用内置终端包的 `TerminalBody` 和 xterm，视图来自 `ctx.get('webTerminals').view(sessionId, contentId, contentId)`，contentId 由 `dsh.deepread.termgen.<sessionId>` 里的 generation 决定。插件不调 `ctx.sidebarRight` 的方法，所以不会去开会话右侧栏。终端帧的订阅放在终端内容组件里，外层不会每一帧都重渲染；PDF 页面用 `content-visibility: auto` 跳过屏幕外的绘制。侧栏图标的 pointerdown 只用 `mainView` 保留当前会话，不再预建 terminal tab。

状态目录是 `$DSH_HOME/deepread/`，里面有 `docs/`、`text/`、`pages/`、`notes/`、`tmp/`。每份文档的页索引在 `text/<id>.json`，词框按页放在 `text/<id>.words/` 里；书籍目录缓存在 `text/<id>.outline.json`，脚本在 `text/outline.jxa`，高亮和笔记在 `notes/<id>.json`，阅读位置在 `positions.json`。

## 限制

本机得有 Poppler，没有的话打开 PDF 会返回一个写清楚的 501。

加密或者要密码的 PDF 不支持。

扫描版 PDF 没有文字层，页面能看，但选中、复制和文档内查找用不了。

网页搜索走 DSH 已经配好的 `ctx.web` provider，没配的时候搜索卡片会报错。

阅读模式不带站点 Cookie，要登录的页面会显示成未登录。脚本很重的站点可能会降级，弹窗是禁掉的。绕过选区桥的跳转（`location.assign`、`meta refresh`）会让选区失效，刷新一下就回来。

终端是面板里的 Web 终端（xterm），不是 iTerm2 本身，也没有 iTerm 那种独立窗口和分屏；深读不再打开外部 iTerm。

终端只属于深读面板，不会出现在会话右侧栏。要在侧栏里跑命令，用会话右上角的「新建终端」。

面板关掉的时候终端没有窗口持有，完全空闲到终端的无人值守回收时间（默认两小时）之后进程会被关掉。那之后再回深读会显示「不可用」，点「新终端」换一个就行。