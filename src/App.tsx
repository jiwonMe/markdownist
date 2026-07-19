import { lazy, Suspense } from 'react'
import { AppHeader } from './components/AppHeader'
import { MarkdownPreview } from './components/MarkdownPreview'
import { useDraft } from './hooks/useDraft'
import { useFontSize } from './hooks/useFontSize'
import { usePrintTheme } from './hooks/usePrintTheme'
import { requestPrint } from './lib/printDocument'
import './styles/fonts.css'
import './styles/app.css'
import './styles/markdown.css'
import './styles/print-themes.css'
import './styles/print.css'

const MarkdownEditor = lazy(async () => {
  const module = await import('./components/MarkdownEditor')
  return { default: module.MarkdownEditor }
})

function App() {
  const { filename, markdown, setFilename, setMarkdown } = useDraft()
  const {
    fontSize,
    canDecrease,
    canIncrease,
    decreaseFontSize,
    increaseFontSize,
  } = useFontSize()
  const { theme: printTheme, setTheme: setPrintTheme } = usePrintTheme()
  const canPrint = markdown.trim().length > 0

  return (
    <div className="app-shell">
      <AppHeader
        filename={filename}
        canPrint={canPrint}
        printTheme={printTheme}
        fontSize={fontSize}
        canDecreaseFontSize={canDecrease}
        canIncreaseFontSize={canIncrease}
        onFilenameChange={setFilename}
        onPrintThemeChange={setPrintTheme}
        onDecreaseFontSize={decreaseFontSize}
        onIncreaseFontSize={increaseFontSize}
        onPrint={() => requestPrint(filename)}
      />
      <main className="app-body">
        <MarkdownPreview
          markdown={markdown}
          fontSize={fontSize}
          printTheme={printTheme}
        />
        <div className="app-split no-print" aria-hidden="true" />
        <Suspense
          fallback={
            <section className="editor-pane no-print" aria-busy="true">
              <div className="editor-pane__loading">편집기 불러오는 중…</div>
            </section>
          }
        >
          <MarkdownEditor
            value={markdown}
            fontSize={fontSize}
            onChange={setMarkdown}
          />
        </Suspense>
      </main>
    </div>
  )
}

export default App
