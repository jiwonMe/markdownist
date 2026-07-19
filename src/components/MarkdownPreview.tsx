import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PrintThemeId } from '../lib/printTheme'
import { remarkPageBreak } from '../lib/remarkPageBreak'

type MarkdownPreviewProps = {
  markdown: string
  fontSize: number
  printTheme: PrintThemeId
}

export function MarkdownPreview({
  markdown,
  fontSize,
  printTheme,
}: MarkdownPreviewProps) {
  const style = {
    '--preview-font-size': `${fontSize}px`,
  } as CSSProperties

  return (
    <section className="preview-pane" aria-label="미리보기" style={style}>
      <div className="preview-pane__scroll">
        <article className="markdown-body" data-print-theme={printTheme}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkPageBreak]} skipHtml>
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  )
}
