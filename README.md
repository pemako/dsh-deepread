# 深读 / DeepRead

一个带左侧栏入口的 DSH Web 插件：左边读 PDF，右边是当前会话本身。

## 使用

1. 点左侧栏的「深读」图标（在 Plugins / Schedules 之后）。
2. 点「打开 PDF」选择本地文件。文件会上传到 Host，用本机 Poppler
   （`pdfinfo`、`pdftotext`、`pdftoppm`）转成页面图片和带坐标的文字层。
3. 拖动中间的分隔条调整左右比例；窄窗口会自动上下堆叠。
4. 选中 PDF 文字后，底部出现选段栏：
   - **复制**：按文字层重建纯文本（中文不会在字间插空格）。
   - **搜索**：在 PDF 页内打开网页搜索卡片；复制文字时卡片也会自动打开并填入内容。
   - **问 AI**：把选段作为普通用户消息发到右侧的真实会话，由当前 Agent 回答。
5. 工具栏支持页码跳转、缩放、文档内查找（上一个/下一个匹配）。
6. 工具栏的 **目录** 按钮打开书签目录树：支持展开/收起、筛选，点击章节跳到对应页；
   当前页会高亮。目录从 PDF 书签读取。
7. 右侧默认上下分栏：上面是真实会话，下面是**终端**，在会话工作区里运行；终端随面板大小自适应。切到「只看对话」或收起右栏时视图断开、进程保持，回来时接回同一个进程。右栏顶部的三段开关可切换 **分栏 / 只看对话 / 只看终端**。
8. 工具栏右侧的 **收起右栏 / 展开右栏** 按钮（右栏头部也有一个同样的收起箭头）可以整块收起右栏（对话 + 终端），PDF 占满面板；右栏只是隐藏，终端进程和会话状态都保持，收起时会提示一次「会话和终端仍在后台运行」。展开后回到收起前的分栏模式和比例；没有打开 PDF 时不提供这个按钮，因为此时没有要加宽的阅读区。选中文字点「问 AI」会临时展开右栏并切到对话（原本在「只看终端」时也能看到回答），这次自动展开不会改写你保存的收起偏好。
9. 终端是**深读面板自己的**一个独立视图：用 `ctx.get('webTerminals').view(sessionId, contentId, contentId)`
   创建，contentId 形如 `deepread-terminal-<generation>`（generation 按会话存在 localStorage）。它**不会**在
   会话右侧栏新建 terminal tab，所以切换会话时右侧栏不会被撑开，也不会被塞进一个终端；字体、主题跟随
   DSH 设置。面板挂载期间视图持有终端附件；离开深读再回来，同一个 contentId 会接回同一个 Host 进程
   （进程还在时），进程已不在则显示「不可用 + 新终端」。「新终端」换一个 generation，先关掉旧进程。
10. 深读不再提供「原生 iTerm 窗口」集成：打开 iTerm 的按钮、窗口自动对齐和 AppleScript 依赖都已移除。
11. 右侧会话默认跟随当前会话；如果切换全局面板导致当前会话丢失，聊天栏有会话下拉框可手动选择。
    切换走后 PDF 会保留，点回「深读」会自动重新打开。
12. **阅读位置按文档自动记忆**：页码、页内比例、缩放都会保存；切换便签墙/其它面板、
    或关闭再打开都会回到上次位置。位置同时写入 Host（`positions.json`）和浏览器
    localStorage，Host 版本用于跨重启，localStorage 用于面板切换时的即时兜底。

## 结构

- `index.js` — Host 半部：PDF 上传/存储、Poppler 解析、页面图片缓存、文档搜索、
  `ctx.web.search` 代理、PDFKit 书签读取（`osascript` + `text/outline.jxa`），以及把选段
  投递到 `ctx.agents.get(sessionId).followup()`。
- `client.js` — 浏览器半部：`sidebar.panellist` 入口、`main` 面板、可拖拽左右/上下分栏、
  PDF 图片 + 文字层、目录树、复制/搜索/提问交互、右栏整块收起（`dsh.deepread.readeronly`），
  以及通过 `conversation.content` Factory 渲染的真实会话。终端加载内置终端包的
  `TerminalBody` / xterm，视图来自 `ctx.get('webTerminals').view(sessionId, contentId, contentId)`，
  contentId 由 `dsh.deepread.termgen.<sessionId>` 的 generation 决定，插件不再调用
  `ctx.sidebarRight` 的任何方法，因此不会打开会话右侧栏。终端帧的订阅放在终端内容组件内部，
  外层不随每帧输出重渲染；PDF 页面使用 `content-visibility: auto` 跳过离屏页面绘制。
  侧栏图标的 pointerdown 只用 `mainView` 保留当前会话，不再预建 terminal tab。
- 状态目录：`$DSH_HOME/deepread/`（`docs/`、`text/`、`pages/`、`tmp/`），
  书籍目录缓存在 `text/<id>.outline.json`，脚本在 `text/outline.jxa`；
  阅读位置在 `positions.json`。

## 限制

- 需要本机安装 Poppler。找不到时打开 PDF 会返回一个明确的 501 错误。
- 加密/需要密码的 PDF 不支持。
- 扫描版 PDF 没有文字层：页面可以看，但选中、复制、文档内搜索不可用。
- 网页搜索走 DSH 已配置的 `ctx.web` provider；未配置时搜索卡片会显示错误。
- 终端是面板内的 Web 终端（xterm），不是 iTerm2 本体，也没有 iTerm 的独立窗口/分屏；深读不再打开外部 iTerm。
- 终端只属于深读面板，不出现在会话右侧栏；要在侧栏里跑命令，请用会话右上角的「新建终端」。
- 面板关闭期间终端没有窗口持有（window hold）：进程会在完全空闲达到终端的无人值守回收时间（默认 2 小时）
  后被关闭；那时再回到深读会显示「不可用」，点「新终端」即可换一个进程。