# Print Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four preset print themes (Classic / Clean / Compact / Report) that restyle preview + print via `data-print-theme` and CSS variables.

**Architecture:** Persist theme id in localStorage (font-size pattern). `usePrintTheme` wires header `<select>` and `MarkdownPreview`. Classic tokens live on `.markdown-body`; other themes override in `print-themes.css`.

**Tech Stack:** React 19, Vite, Vitest, plain CSS (no new deps).

## Global Constraints

- Presets only: `classic` | `clean` | `compact` | `report`
- Default `classic`; invalid storage → `classic`
- Theme is app preference, not part of draft v1
- Image outline stays pure black/white (better-ui)
- No page margin / page-number settings in this plan

---

### Task 1: printTheme lib + tests

**Files:**
- Create: `src/lib/printTheme.ts`
- Create: `src/lib/printTheme.test.ts`

- [x] Write failing tests (default, round-trip, unknown → classic)
- [x] Implement `isPrintThemeId` / `loadPrintTheme` / `savePrintTheme` / options
- [x] Verify tests pass

### Task 2: usePrintTheme hook

**Files:**
- Create: `src/hooks/usePrintTheme.ts`

- [x] Mirror `useFontSize` persistence pattern

### Task 3: CSS tokens + theme overrides

**Files:**
- Modify: `src/styles/markdown.css`
- Create: `src/styles/print-themes.css`
- Modify: `src/App.tsx` (import)

- [x] Tokenize markdown.css with Classic defaults
- [x] Add clean / compact / report overrides

### Task 4: Wire UI

**Files:**
- Modify: `src/components/AppHeader.tsx`
- Modify: `src/components/MarkdownPreview.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css` (select styles)
- Modify: `src/App.test.tsx`
- Modify: `README.md`

- [x] Header select + preview `data-print-theme`
- [x] App integration test
- [x] README mention
- [x] Full test suite + commit
