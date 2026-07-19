import Editor from '@monaco-editor/react'
import '../monaco/setupMonaco'

type MarkdownEditorProps = {
  value: string
  fontSize: number
  onChange: (value: string) => void
}

export function MarkdownEditor({
  value,
  fontSize,
  onChange,
}: MarkdownEditorProps) {
  return (
    <section className="editor-pane no-print" aria-label="Markdown 편집기">
      <Editor
        height="100%"
        width="100%"
        language="markdown"
        theme="vs-dark"
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        loading={<div className="editor-pane__loading">편집기 불러오는 중…</div>}
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
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </section>
  )
}
