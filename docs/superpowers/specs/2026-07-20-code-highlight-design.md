# Code Highlighting Design

Date: 2026-07-20  
Status: Approved — implemented  
Scope: Language-aware fenced-code highlighting in preview/print via highlight.js

## Goal

Colorize Markdown fenced code blocks (```` ```lang ````) in the live preview and printed PDF using highlight.js, without dark themes or print-unfriendly effects.

## Non-goals

- Shiki / Prism / Monaco-in-preview
- Highlighting inline `` `code` ``
- Per-theme or user-selectable highlight palettes
- Loading every highlight.js language pack
- Changing Monaco editor highlighting

## Decisions

| Decision | Choice |
| --- | --- |
| Engine | `rehype-highlight` + `highlight.js` |
| Integration | `rehypePlugins` on `ReactMarkdown` in `MarkdownPreview` |
| Theme | Single light, print-safe palette scoped under `.markdown-body` |
| Languages | Common subset (js/ts/jsx/tsx, python, go, rust, java, c/cpp, json, yaml, css/scss, html, bash/shell, markdown, sql, …) |
| Inline code | Unchanged (no hljs) |
| Shadows | None — borders/background tokens only |

## Architecture

```
MarkdownPreview
  ReactMarkdown
    remarkPlugins: [gfm, directive, …]
    rehypePlugins: [rehypeHighlight]
  markdown.css → .markdown-body .hljs / .hljs-* token colors
```

Unknown languages fall back to plain `pre > code` (hljs default behavior).

## Testing

- Unit/integration: fenced ```` ```ts ```` renders `.hljs` / language class in preview
- Lint + build

## Docs

- README feature bullet
- Default draft includes a short TypeScript fence
- AGENTS.md note
