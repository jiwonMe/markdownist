# Code Highlighting Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Fenced code language highlighting via rehype-highlight + light print-safe CSS.

**Architecture:** Wire `rehypeHighlight` into `MarkdownPreview`; token colors in `markdown.css` under `.markdown-body .hljs*`.

**Tech Stack:** `rehype-highlight`, `highlight.js`, react-markdown, vitest

## Global Constraints

- Light theme only; no box-shadow on code
- Common languages only
- Preview === print DOM

---

### Task 1: Wire rehype-highlight

- [x] Install deps
- [x] Add `rehypePlugins={[rehypeHighlight]}` in MarkdownPreview
- [x] Test that ```` ```ts ```` yields `.hljs` in DOM

### Task 2: Light theme CSS + docs

- [x] Add `.hljs` token colors (OKLCH, scoped)
- [x] Default markdown + README + AGENTS
- [x] `npm test && npm run lint && npm run build`
