# Upmath Math Design

Date: 2026-07-20  
Status: Approved — implementing  
Scope: LaTeX math in preview + print via Upmath embedding (not KaTeX/MathJax)

## Goal

Let authors write LaTeX in Markdown with `$$...$$` and see rendered formulas in the live preview and printed PDF, using [Upmath embedding](https://i.upmath.me/#embedding).

## Non-goals

- KaTeX, MathJax, or other client-side TeX engines
- Single-dollar `$...$` delimiters (Upmath only documents `$$...$$`)
- Offline formula rendering or bundling TeX fonts/engines
- Equation numbering UI beyond what Upmath’s script already supports
- Editing formulas in a separate WYSIWYG math editor

## Decisions

| Decision | Choice |
| --- | --- |
| Renderer | Upmath `https://i.upmath.me/latex.js` → SVG/PNG from `i.upmath.me` |
| Delimiter | `$$formula$$` only (inline or display) |
| Integration | Official script + `window.S2Latex.processTree` on `.markdown-body` after React render |
| Script load timing | Load **before** React mounts so the script’s one-time `processTree(document.body)` runs on an empty `#root` and does not touch Monaco |
| Live updates | Debounced re-process (~300ms) after markdown changes |
| Code protection | Temporarily mask `$$` inside `pre`/`code` text nodes before `processTree` |
| Print | Await pending process + wait for `.latex-svg` / `.latex-png` load (or error), timeout ~8s, then `window.print()` |
| Network | Required for preview images and print; failures leave `$$...$$` text or broken images |

## Syntax (author-facing)

Inline:

```md
질량-에너지 동등성은 $$E=mc^2$$ 입니다.
```

Display (paragraph that is only the formula — Upmath centers it):

```md
$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

(Blank lines around a sole `$$...$$` paragraph are fine; the script treats a `<p>` that is essentially one formula as centered.)

## Architecture

```
main.tsx
  └─ loadUpmathLatex()          # inject script once; exposes S2Latex
  └─ <App />
       └─ MarkdownPreview
            └─ ReactMarkdown → text nodes with $$...$$
            └─ useEffect(debounced) → processMarkdownLatex(article)
       └─ requestPrint(filename)
            └─ flush + waitForLatexImages(preview) → window.print()
```

### Modules

- `src/lib/upmathLatex.ts`
  - `UPMATH_LATEX_SCRIPT_SRC`
  - `loadUpmathLatex(): Promise<void>`
  - `processMarkdownLatex(root: HTMLElement): void` — protect `pre`/`code`, call `S2Latex.processTree(root)`
  - `waitForLatexImages(root: ParentNode, timeoutMs?: number): Promise<void>`
- `src/main.tsx` — await `loadUpmathLatex()` before `createRoot(...).render`
- `src/components/MarkdownPreview.tsx` — ref on article + debounced process
- `src/lib/printDocument.ts` — `requestPrint` becomes async and waits for images

## Print behavior

1. Flush any pending debounce (process immediately once).
2. `waitForLatexImages` on `.markdown-body` (or preview root): every `img.latex-svg` / `img.latex-png` settles (`complete` / `load` / `error`), or 8s timeout.
3. Existing title swap + `window.print()` / `afterprint` restore.

## Testing

- Unit: `waitForLatexImages` resolves on complete/error/timeout; `processMarkdownLatex` leaves `$$` inside `code` alone (jsdom + mock `S2Latex`).
- Unit: `requestPrint` awaits image wait (mock) before calling `print`.
- Docs: README + default draft mention `$$...$$` / Upmath.

## Risks

| Risk | Mitigation |
| --- | --- |
| Script auto-scans `document.body` | Load before React mount |
| Monaco contains `$$` | Never call `processTree` on body after mount; only `.markdown-body` |
| Typing storms Upmath | 300ms debounce |
| Print before images paint | Explicit wait + timeout |
| Upmath downtime | Degrade to raw `$$` text; no app crash |
