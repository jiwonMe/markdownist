## Learned User Preferences

- Prefers Korean for product UI copy and day-to-day chat about this app; print-theme option labels stay in English.
- Document typography: headings, tables, and bold use Toss Product Sans; body uses BookkMyungjo (부크크 명조); code/pre use a real monospace stack (JetBrains Mono), not generic `monospace`.
- Preview font-size controls must also apply in print; do not hardcode a separate print font size that ignores the chosen size.
- Horizontal rules (`---`) should act as page breaks (alongside `<!-- pagebreak -->`); keep heading underlines off; keep `pre`/code-block line-height at 1; keep tables visually compact.
- Right-hand Monaco editor should stay dark (`vs-dark`); app chrome may follow a cool Vercel/Linear-like light shell.
- Prefers print/document themes over app UI themes; theme presets via CSS variables + `data-print-theme`, presets-only (no custom CSS editor), persisted separately from the draft like font size.
- When asked to ship a feature, prefers going through design → implement → verify end-to-end; often pairs “commit push” as a single follow-up.
- Uses project skills under `.agents/skills` (better-ui / better-typography / better-colors), mirrored for Claude and Cursor via symlinks.

## Learned Workspace Facts

- Markdownist is a client-only Vite + React + TypeScript SPA (npm) that prints Markdown to multi-page A4 PDF via `window.print()` and `@media print` on the same preview DOM.
- Layout baseline: left continuous preview, right Monaco Markdown editor, header with filename and print; GFM via `react-markdown` + `remark-gfm`; raw HTML not executed except the dedicated page-break path.
- Draft markdown/filename, font size, and print theme each persist in `localStorage` under separate keys; empty markdown disables print.
- Repo: `github.com/jiwonMe/markdownist`; deployed on Vercel; `.cursor/` and Vercel local/env files are gitignored.
- Project agent skills live in `.agents/skills`, with `.claude/skills` and `.cursor/skills` as symlinks to the same trees.
- Print themes are implemented as `data-print-theme` tokens in CSS: Classic / Clean / Compact / Report plus purpose presets Academic / Memo / Resume / Blog.
