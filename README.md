# DeepRead

DeepRead adds a sidebar entry that opens a reading pane. The left side shows a PDF or a web page, and the right side is the conversation you're already in. The PDF / Web page switch in the toolbar only changes what the left side shows; the chat, the terminal, and the selection bar along the bottom stay as they are.

## Install

Open Plugins → Add plugin and enter:

```
@pemako/dsh-deepread
```

Add `@<version>` if you want to stay on a fixed release. A DeepRead entry appears in the sidebar afterwards. PDF pages are drawn by the bundled pdfjs engine in the browser and their words come from the local `pdftotext`, so install Poppler first.

## Requirements

PDF text needs Poppler's `pdftotext` on the machine that runs DSH: `brew install poppler` on macOS, `apt install poppler-utils` on Debian/Ubuntu, `scoop install poppler` on Windows. A desktop launch may not see a Homebrew install, so the plugin looks in the usual locations and falls back to `PATH`; `DEEPREAD_POPPLER_DIR` points it at a custom directory. Poppler is a system program, not an npm package, so it cannot arrive as a dependency.

Pages are drawn by the bundled `pdfjs-dist` engine in the browser, and bookmark outlines come from it too, so nothing here is macOS-only.

## Getting going

Click DeepRead in the sidebar. For a PDF, choose a file from the empty state; it goes up to the Host, which extracts a text layer with coordinates using pdftotext, and the browser draws the pages themselves with pdfjs. For a web page, type the address: a bare domain gets https, something like `localhost:3000` gets http. Back, forward, reload, and open-in-system-browser act on whatever page is loaded.

Drag the divider to change the split. A narrow window stacks the two sides instead.

Select text in either mode and the same bar appears at the bottom. Copy rebuilds plain text from the text layer, so Chinese doesn't come out with spaces between characters. Search opens a web search card inside the PDF; copying also opens it with the text already filled in. Ask AI sends the selection to the real conversation on the right as an ordinary user message, with the page title and address along for the ride when you're reading a page.

Selections can also be kept. Pick a highlight colour, and the passage stays marked on the page; each highlight takes a note. The highlights button lists them by page, jumps to one, changes its colour or note, and removes it. They live next to the document on the Host, so they are still there after a restart and after switching computers.

The toolbar keeps the reading controls on the left (page, zoom, find) and the actions on the right as icons: contents, highlights, documents, the right-pane layout, the session picker and the conversation entry. A find shows the hits as a list of pages with a snippet, and clicking one goes there; typing no longer moves the page on its own. Zoom redraws the page at its new size, so it stays sharp instead of blurring an upscaled bitmap. The contents icon opens the PDF bookmarks as a tree you can filter and click through, with the current page marked. Icons name themselves on hover, and when the window is too narrow for everything a More menu holds whatever no longer fits.

The documents button keeps what the reader has stored, newest first. Open another one from that list, or remove one together with its highlights.

Page mode has its own zoom as well: the −/percentage/+ control, or ⌘/Ctrl with the scroll wheel. It changes the layout width of the iframe and then scales the result, so text reflows the way browser zoom does instead of becoming a magnified picture. The level is remembered.

## The right side

The right pane starts as a vertical split with the conversation on top and a terminal underneath, running in the session workspace and sizing itself to the pane. The three-way switch in the top bar picks split, conversation only, or terminal only. Leaving the terminal detaches its view but keeps the process, and coming back reattaches the same one.

The collapse button at the end of the top bar hides the whole right side so the reading area takes over the panel. The terminal keeps running while it's hidden, and the panel mentions that once. Expanding brings back the split and ratio you had. With no PDF open the button isn't there, since there's nothing to widen. Asking AI with a selection expands the pane and switches to the conversation even from terminal-only mode, without touching the collapsed preference you saved.

The terminal belongs to DeepRead. It's created through `ctx.get('webTerminals').view(sessionId, contentId, contentId)` with a contentId like `deepread-terminal-<generation>`, where the generation is kept per session in localStorage. It doesn't add a tab to the session's own right sidebar, so switching sessions never opens that sidebar or drops a terminal into it. Fonts and theme follow DSH. While the panel is mounted the view holds the terminal; after leaving and coming back, the same contentId reattaches to the Host process if it's still alive. Otherwise you get "unavailable" and a New terminal button, which starts a new generation after closing the old one.

DeepRead no longer opens an iTerm window. The iTerm button, the window alignment, and the AppleScript they needed are gone.

The conversation follows the current session. If switching a global panel leaves no current session, the chat bar has a dropdown to pick one. The PDF stays open, and clicking DeepRead again brings it back.

## Positions

Page number, in-page ratio, and zoom are saved per document. Switch panels or restart and the next visit lands where you left off. Positions go to the Host in `positions.json` and to the browser's localStorage; the Host copy survives restarts and the localStorage copy keeps panel switches quick.

## Reading web pages

Reader mode proxies the page through the Host route `/dsh-deepread/api/page`. It drops the origin's `X-Frame-Options` and CSP, adds a `<base>` so the origin's CSS, images, and scripts still come from the origin, and injects the selection bridge at `/dsh-deepread/api/bridge.js`. The proxied document carries `Content-Security-Policy: sandbox`, so opening it on its own still can't reach the app's origin. The panel only gets what the bridge reports: selected text, links, GET form searches, and the title.

Original mode loads the page as it is inside a sandboxed iframe, which suits sites that need their own origin. There's no bridge in this mode, so selection-based actions are off; the panel says so and offers a way back to reader mode.

Reader mode finds text inside the page too: the find field counts the matches, highlights them in the page, and steps through them without leaving the reader.

Links and GET search forms go back to the panel, which proxies them again, so the iframe never wanders off to another site by itself. POST forms and Cmd/Ctrl+click open in the system browser. A page is capped at 12 MB. The address, source, mode, and page zoom are remembered on their own; PDFs and their positions are kept separately.

## Files

`index.js` is the Host half: upload and storage, the `pdftotext` word extraction, the PDF file route with byte ranges, serving the bundled pdfjs engine, document search, the `ctx.web.search` proxy, the page proxy and selection bridge, opening the system browser, and delivering a selection to `ctx.agents.get(sessionId).followup()`.

`client.js` is the browser half: the `sidebar.panellist` entry, the main panel, the draggable splits, pdfjs canvases and the pdftotext text layer, the outline tree, copy/search/ask, the PDF and page source switch, the page toolbar and bridge messages, collapsing the right pane (`dsh.deepread.readeronly`), and the live conversation rendered through the `conversation.content` Factory. The terminal uses the bundled terminal package's `TerminalBody` and xterm. Frame subscriptions sit inside the terminal content component so the outer layer doesn't re-render on every frame, and PDF pages use `content-visibility: auto` to skip drawing pages that are off screen. The sidebar icon's pointerdown only calls `mainView` to keep the current session; it no longer pre-creates a terminal tab.

State lives in `$DSH_HOME/deepread/`: `docs/`, `text/`, `notes/`, and `tmp/`. A document keeps its page index in `text/<id>.json` and its word boxes under `text/<id>.words/`, one file per page; highlights and notes live in `notes/<id>.json`, and positions in `positions.json`. Nothing else is stored: the browser draws each page from the PDF itself.

## Limits

Poppler's `pdftotext` has to be installed. Without it, opening a PDF returns a 501 with install commands.

Encrypted PDFs aren't supported.

Scanned PDFs have no text layer, so you can look at the pages but selection, copy, and find won't work.

A rotated page (a `/Rotate` entry) can put the text layer out of step with the drawn page.

Web search uses whichever `ctx.web` provider DSH has configured. With none configured, the search card shows an error.

Reader mode doesn't carry site cookies, so pages behind a login show as logged out. Script-heavy sites may degrade. Popups are off. A navigation that skips the bridge (`location.assign`, `meta refresh`) drops the selection until you reload.

The terminal is a web terminal inside the panel, not iTerm2, and it has no separate window or split of its own. DeepRead doesn't open external iTerm.

The terminal lives in the DeepRead panel and doesn't appear in the session's right sidebar. For a terminal there, use New terminal in the top-right of the session.

While the panel is closed the terminal has no window holding it, so after its idle reclaim time (two hours by default) the process is closed. Coming back then shows "unavailable", and New terminal gives you a fresh one.