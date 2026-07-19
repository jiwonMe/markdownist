# Print Theme Design

Date: 2026-07-19  
Status: Draft for review  
Scope: Preset print themes for Markdownist preview + print output

## Goal

Let users switch the **document look** (preview and printed PDF) among a small set of curated presets, without changing app chrome or requiring custom CSS.

## Non-goals

- Dark mode for the app shell / Monaco editor
- User-editable CSS or theme token editors
- Page size / margin / page-number settings (future)
- Content templates (starter markdown) — separate feature
- Syncing theme into draft payload (theme is app preference, like font size)

## Decisions

| Decision | Choice |
| --- | --- |
| Skin depth | Full skin: typography, layout spacing, links, code, tables, blockquotes, page-break chrome |
| Preset count | 4: `classic`, `clean`, `compact`, `report` |
| Customization | Presets only |
| Implementation | CSS variables + `data-print-theme` on `.markdown-body` |
| Persistence | Separate `localStorage` key (same pattern as font size) |
| Default | `classic` (closest to current BookkMyungjo body look) |

## Themes

| ID | Label | Intent |
| --- | --- | --- |
| `classic` | Classic | Serif body (BookkMyungjo), sans headings — current baseline |
| `clean` | Clean | All sans (Pretendard), airy spacing, quiet dividers |
| `compact` | Compact | Sans, tighter line-height and block gaps, slightly wider measure |
| `report` | Report | Sans, strong headings (hairline under h1/h2), emphasized tables/code |

## Data model

```ts
// src/lib/printTheme.ts
export type PrintThemeId = 'classic' | 'clean' | 'compact' | 'report'

export const PRINT_THEME_STORAGE_KEY = 'markdownist:print-theme:v1'
export const DEFAULT_PRINT_THEME: PrintThemeId = 'classic'
export const PRINT_THEME_OPTIONS: { id: PrintThemeId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'clean', label: 'Clean' },
  { id: 'compact', label: 'Compact' },
  { id: 'report', label: 'Report' },
]

export function isPrintThemeId(value: unknown): value is PrintThemeId
export function loadPrintTheme(storage?: Storage): PrintThemeId
export function savePrintTheme(theme: PrintThemeId, storage?: Storage): void
```

Hook:

```ts
// src/hooks/usePrintTheme.ts
export function usePrintTheme(): {
  theme: PrintThemeId
  setTheme: (theme: PrintThemeId) => void
}
```

Invalid or missing storage values fall back to `classic`.

## DOM / CSS architecture

1. `MarkdownPreview` sets `data-print-theme={theme}` on `.markdown-body`.
2. Screen preview and `@media print` share the same DOM — no print-only theme wiring.
3. Refactor `markdown.css` so element rules read CSS variables (e.g. `--md-font-body`, `--md-line-height`, `--md-link`, `--md-code-bg`, `--md-table-header-bg`, `--md-quote-border`).
4. Default variable values on `.markdown-body` encode **Classic**.
5. Theme overrides live in `src/styles/print-themes.css` (imported from `App.tsx`) under `.markdown-body[data-print-theme='clean'|…]`. Classic needs no override block when defaults already encode it; still set `data-print-theme="classic"` for a stable attribute.
6. `print.css` stays responsible for page boxes, hiding chrome, and page-break behavior — not theme tokens.
7. Existing `--preview-font-size` (A−/A+) continues to apply on top of every theme.

### Token set (minimum)

| Token | Controls |
| --- | --- |
| `--md-font-body` | Body / paragraphs / lists |
| `--md-font-heading` | h1–h6, strong |
| `--md-font-heading-weight` | Heading weight |
| `--md-letter-spacing-heading` | Heading tracking |
| `--md-line-height` | Body line-height |
| `--md-block-gap` | Vertical rhythm between blocks |
| `--md-max-width` | `.markdown-body` max-width |
| `--md-link` / `--md-link-hover` | Anchor colors |
| `--md-code-bg` / `--md-code-radius` / `--md-code-shadow` | Inline code |
| `--md-pre-bg` / `--md-pre-radius` / `--md-pre-shadow` | Fenced blocks |
| `--md-quote-border` / `--md-quote-fg` / `--md-quote-bg` | Blockquote |
| `--md-table-border` / `--md-table-header-bg` / `--md-table-cell-pad` | Tables |
| `--md-hr` | Horizontal rules |
| `--md-img-radius` | Image corner radius (outline stays pure black/white per better-ui) |
| `--md-pagebreak-border` / `--md-pagebreak-fg` / `--md-pagebreak-margin` | Preview page-break marker |
| `--md-heading-rule` | Optional h1/h2 underline (Report; `transparent` elsewhere) |

### Per-theme deltas (summary)

| | Classic | Clean | Compact | Report |
| --- | --- | --- | --- | --- |
| Body font | BookkMyungjo | Pretendard | Pretendard | Pretendard |
| Headings | Pretendard 700 | Pretendard 600, tighter tracking | Pretendard 600, ~1 step smaller | Pretendard 700 + hairline under h1/h2 |
| Line-height | 1.7 | 1.75 | 1.5 | 1.65 |
| Block gap | 1em | ~1.15em | ~0.75em | 1em |
| Max-width | 720px | 680px | 760px | 720px |
| Links | Cool blue | Ink + underline | Cool blue | Ink + underline |
| Code | Soft chip | Softer chip | Smaller chip | Darker chip + stronger ring |
| Tables | Thin border | Minimal border, header only | Dense padding | Emphasized header bg |
| Quote | 2px rule | Lighter rule + muted | Thin rule | Thicker rule + light tint |

Report-specific: `h1`/`h2` use `border-bottom: 1px solid var(--md-heading-rule)` with modest padding-bottom. Other themes set `--md-heading-rule: transparent`.

## UI

- Native `<select>` in `AppHeader`, placed to the **left** of the font-size control group.
- Visual label optional (“테마”); always `aria-label="인쇄 테마"`.
- Options use human labels from `PRINT_THEME_OPTIONS`.
- Control height 32px; muted fill + `--shadow-border` to match existing header controls.
- Changing the select calls `setTheme` immediately (no Apply button).

Wiring: `App` owns `usePrintTheme()`, passes `theme` / `onThemeChange` into `AppHeader` and `theme` into `MarkdownPreview`.

## Testing

| Area | Cases |
| --- | --- |
| `printTheme` unit | default; persist round-trip (plain string id, like font size); unknown/empty id → `classic` |
| App integration | selecting Clean sets `data-print-theme="clean"`; value stored under `PRINT_THEME_STORAGE_KEY` |
| Regression | font-size controls still update `--preview-font-size`; print still enabled only when markdown non-empty |

No visual snapshot tests required for v1.

## File touch list

| File | Change |
| --- | --- |
| `src/lib/printTheme.ts` | new |
| `src/lib/printTheme.test.ts` | new |
| `src/hooks/usePrintTheme.ts` | new |
| `src/components/AppHeader.tsx` | theme select |
| `src/components/MarkdownPreview.tsx` | `data-print-theme` |
| `src/App.tsx` | wire hook + import theme CSS if split |
| `src/styles/markdown.css` | tokenize + classic defaults |
| `src/styles/print-themes.css` | theme overrides (clean / compact / report) |
| `src/App.test.tsx` | theme selection coverage |
| `README.md` | mention print themes |

## Out of scope follow-ups

- Page margins / page numbers / header-footer
- Content templates bundled with a default theme
- Export themed HTML file
- Per-document theme stored inside draft v2
