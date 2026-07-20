## Learned User Preferences

- Prefers Korean for product UI copy and day-to-day chat about this app; print-theme option labels stay in English.
- Document typography: headings, tables, and bold use Toss Product Sans; body uses BookkMyungjo (부크크 명조); code/pre use a real monospace stack (JetBrains Mono), not generic `monospace`.
- Preview font-size controls must also apply in print; do not hardcode a separate print font size that ignores the chosen size.
- Horizontal rules (`---`) should act as page breaks (alongside `<!-- pagebreak -->`); keep heading underlines off; keep `pre`/code-block line-height at 1; keep tables visually compact.
- Right-hand Monaco editor should stay dark (`vs-dark`); app chrome may follow a cool Vercel/Linear-like light shell.
- Prefers print/document themes over app UI themes; theme presets via CSS variables + `data-print-theme`, persisted separately from the draft like font size.
- Document/print styles should avoid drop shadows and other print-unfriendly effects; prefer borders. `@media print` strips box-shadow / text-shadow / filter on `.markdown-body`.
- Editor pane has tabs for `{filename}.md`, `style.css`, and `directives.json`; custom CSS/directives persist separately from the draft.
- Custom CSS is injected into preview/print via `@scope (.markdown-body)`. CSS tab can append print-theme token blocks.
- Markdown directives use `remark-directive`: builtins note/tip/warning/important; user directives registered in `directives.json` as `{ name, label }` and styled via `.md-directive--{name}`. style.css insert chips auto-list builtins + user directives.
- Math uses Upmath embedding (inline `$...$`, display `$$...$$` + `i.upmath.me/latex.js`), not KaTeX/MathJax; `remark-math` parses math before Markdown setext/emphasis, then `remarkMathToUpmath` emits literal `$$` for Upmath; script loads before React mount; preview re-processes `.markdown-body` (debounced); print waits for latex images.
- Fenced code highlighting uses `rehype-highlight` (highlight.js common languages) with a single light, print-safe `.hljs` palette under `.markdown-body`; inline code is not highlighted.
- When asked to ship a feature, prefers going through design → implement → verify end-to-end; often pairs “commit push” as a single follow-up.
- Uses project skills under `.agents/skills` (better-ui / better-typography / better-colors), mirrored for Claude and Cursor via symlinks.

## Learned Workspace Facts

- Markdownist is a client-only Vite + React + TypeScript SPA (npm) that prints Markdown to multi-page A4 PDF via `window.print()` and `@media print` on the same preview DOM.
- Layout baseline: left continuous preview, right Monaco Markdown editor, header with filename and print; GFM via `react-markdown` + `remark-gfm`; raw HTML not executed except the dedicated page-break path.
- Draft markdown/filename, font size, print theme, and custom CSS each persist in `localStorage` under separate keys; empty markdown disables print.
- Repo: `github.com/jiwonMe/markdownist`; deployed on Vercel; `.cursor/` and Vercel local/env files are gitignored.
- Project agent skills live in `.agents/skills`, with `.claude/skills` and `.cursor/skills` as symlinks to the same trees.
- Print themes are implemented as `data-print-theme` tokens in CSS: Classic / Clean / Compact / Report plus purpose presets Academic / Memo / Resume / Blog.
