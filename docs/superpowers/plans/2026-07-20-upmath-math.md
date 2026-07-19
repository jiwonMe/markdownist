# Upmath Math Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `$$...$$` LaTeX in preview/print via Upmath `latex.js`, waiting for images before print.

**Architecture:** Load Upmath script before React mount; debounced `S2Latex.processTree` on `.markdown-body` (with `pre`/`code` protection); async `requestPrint` waits for latex images.

**Tech Stack:** Vite + React 19, Upmath `https://i.upmath.me/latex.js`, vitest

## Global Constraints

- No KaTeX/MathJax — Upmath only
- Delimiter: `$$...$$` only
- Korean UI/docs copy; keep existing print title behavior
- Network required for formula images

## File map

| File | Role |
| --- | --- |
| `src/lib/upmathLatex.ts` | load script, process preview, wait for images |
| `src/lib/upmathLatex.test.ts` | unit tests |
| `src/main.tsx` | await load before render |
| `src/components/MarkdownPreview.tsx` | debounced process |
| `src/lib/printDocument.ts` | async print + wait |
| `src/lib/printDocument.test.ts` | update for async |
| `src/lib/draftStorage.ts` | default markdown example |
| `README.md` / `AGENTS.md` | document math support |

---

### Task 1: `upmathLatex` helpers

**Files:**
- Create: `src/lib/upmathLatex.ts`
- Create: `src/lib/upmathLatex.test.ts`

- [ ] **Step 1:** Write failing tests for `processMarkdownLatex` (skips code) and `waitForLatexImages`
- [ ] **Step 2:** Implement `loadUpmathLatex`, `processMarkdownLatex`, `waitForLatexImages`, optional `flushMarkdownLatex` / pending-callback for print
- [ ] **Step 3:** Pass tests

### Task 2: Wire preview + bootstrap

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/components/MarkdownPreview.tsx`

- [ ] **Step 1:** Await `loadUpmathLatex()` before `createRoot().render`
- [ ] **Step 2:** Article ref + 300ms debounced `processMarkdownLatex` on markdown/css/theme changes that affect body

### Task 3: Print wait + docs

**Files:**
- Modify: `src/lib/printDocument.ts`, `src/lib/printDocument.test.ts`, `src/App.tsx`
- Modify: `src/lib/draftStorage.ts`, `README.md`, `AGENTS.md`

- [ ] **Step 1:** `requestPrint` async: process preview root, wait images (8s), then print
- [ ] **Step 2:** Default markdown + README mention Upmath `$$`
- [ ] **Step 3:** `npm test && npm run lint && npm run build`
