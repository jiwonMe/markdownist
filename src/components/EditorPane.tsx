import Editor from '@monaco-editor/react'
import {
  CSS_QUICK_SNIPPETS,
  appendCssSnippet,
} from '../lib/cssSnippets'
import {
  PRINT_THEME_OPTIONS,
  isPrintThemeId,
} from '../lib/printTheme'
import { formatPrintThemeAsCustomCss } from '../lib/printThemeCss'
import '../monaco/setupMonaco'

export type EditorTab = 'markdown' | 'css' | 'directives'

type EditorPaneProps = {
  filename: string
  markdown: string
  css: string
  directivesJson: string
  directivesError: string | null
  fontSize: number
  activeTab: EditorTab
  onTabChange: (tab: EditorTab) => void
  onMarkdownChange: (value: string) => void
  onCssChange: (value: string) => void
  onDirectivesChange: (value: string) => void
}

function tabLabel(filename: string): string {
  const trimmed = filename.trim()
  return trimmed.length > 0 ? trimmed : 'untitled.md'
}

export function EditorPane({
  filename,
  markdown,
  css,
  directivesJson,
  directivesError,
  fontSize,
  activeTab,
  onTabChange,
  onMarkdownChange,
  onCssChange,
  onDirectivesChange,
}: EditorPaneProps) {
  const markdownTabLabel = tabLabel(filename)
  const isMarkdown = activeTab === 'markdown'
  const isCss = activeTab === 'css'
  const isDirectives = activeTab === 'directives'

  const editorValue = isMarkdown
    ? markdown
    : isCss
      ? css
      : directivesJson

  const editorLanguage = isMarkdown ? 'markdown' : isCss ? 'css' : 'json'

  const editorPath = isMarkdown
    ? `markdownist://${markdownTabLabel}`
    : isCss
      ? 'markdownist://style.css'
      : 'markdownist://directives.json'

  return (
    <section className="editor-pane no-print" aria-label="편집기">
      <div className="editor-pane__tabs" role="tablist" aria-label="편집 파일">
        <button
          type="button"
          className={
            isMarkdown
              ? 'editor-pane__tab editor-pane__tab--active'
              : 'editor-pane__tab'
          }
          role="tab"
          id="editor-tab-markdown"
          aria-selected={isMarkdown}
          aria-controls="editor-panel"
          tabIndex={isMarkdown ? 0 : -1}
          onClick={() => onTabChange('markdown')}
        >
          {markdownTabLabel}
        </button>
        <button
          type="button"
          className={
            isCss
              ? 'editor-pane__tab editor-pane__tab--active'
              : 'editor-pane__tab'
          }
          role="tab"
          id="editor-tab-css"
          aria-selected={isCss}
          aria-controls="editor-panel"
          tabIndex={isCss ? 0 : -1}
          onClick={() => onTabChange('css')}
        >
          style.css
        </button>
        <button
          type="button"
          className={
            isDirectives
              ? 'editor-pane__tab editor-pane__tab--active'
              : 'editor-pane__tab'
          }
          role="tab"
          id="editor-tab-directives"
          aria-selected={isDirectives}
          aria-controls="editor-panel"
          tabIndex={isDirectives ? 0 : -1}
          onClick={() => onTabChange('directives')}
        >
          directives.json
        </button>
      </div>
      {isCss ? (
        <div
          className="editor-pane__snippets"
          role="toolbar"
          aria-label="CSS 빠른 삽입"
        >
          <div className="editor-pane__snippet-group">
            <label className="editor-pane__theme-load">
              <span className="editor-pane__snippets-label">테마</span>
              <select
                className="editor-pane__theme-load-select"
                aria-label="테마를 style.css에 불러오기"
                defaultValue=""
                onChange={(event) => {
                  const value = event.target.value
                  event.target.value = ''
                  if (!isPrintThemeId(value)) {
                    return
                  }
                  onCssChange(
                    appendCssSnippet(css, formatPrintThemeAsCustomCss(value)),
                  )
                }}
              >
                <option value="" disabled>
                  불러오기…
                </option>
                {PRINT_THEME_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="editor-pane__snippet-group">
            <span className="editor-pane__snippets-label">삽입</span>
            {CSS_QUICK_SNIPPETS.map((snippet) => (
              <button
                key={snippet.id}
                type="button"
                className="editor-pane__snippet"
                title={snippet.detail}
                onClick={() =>
                  onCssChange(appendCssSnippet(css, snippet.code))
                }
              >
                {snippet.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {isDirectives ? (
        <div className="editor-pane__directives-meta" role="status">
          {directivesError ? (
            <p className="editor-pane__directives-error">{directivesError}</p>
          ) : (
            <p className="editor-pane__directives-hint">
              빌트인: note, tip, warning, important · 예:{' '}
              <code>{':::aside[제목]'}…{':::'}</code>
            </p>
          )}
        </div>
      ) : null}
      <div
        className="editor-pane__body"
        id="editor-panel"
        role="tabpanel"
        aria-labelledby={
          isMarkdown
            ? 'editor-tab-markdown'
            : isCss
              ? 'editor-tab-css'
              : 'editor-tab-directives'
        }
      >
        <Editor
          height="100%"
          width="100%"
          path={editorPath}
          language={editorLanguage}
          theme="vs-dark"
          value={editorValue}
          onChange={(nextValue) => {
            const value = nextValue ?? ''
            if (isMarkdown) {
              onMarkdownChange(value)
            } else if (isCss) {
              onCssChange(value)
            } else {
              onDirectivesChange(value)
            }
          }}
          loading={
            <div className="editor-pane__loading">편집기 불러오는 중…</div>
          }
          options={{
            automaticLayout: true,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize,
            fontLigatures: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'same',
            tabSize: 2,
            renderLineHighlight: 'gutter',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 16, bottom: 16 },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            formatOnPaste: !isMarkdown,
            formatOnType: isCss,
            snippetSuggestions: 'inline',
            quickSuggestions: isMarkdown
              ? true
              : {
                  other: true,
                  comments: false,
                  strings: true,
                },
            suggestOnTriggerCharacters: true,
            tabCompletion: 'on',
            colorDecorators: isCss,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </section>
  )
}
