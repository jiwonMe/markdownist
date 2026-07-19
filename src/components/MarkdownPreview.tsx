import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkPageBreak } from '../lib/remarkPageBreak'

type MarkdownPreviewProps = {
  markdown: string
  fontSize: number
}

export function MarkdownPreview({ markdown, fontSize }: MarkdownPreviewProps) {
  const style = {
    '--preview-font-size': `${fontSize}px`,
  } as CSSProperties

  return (
    <section className="preview-pane" aria-label="미리보기" style={style}>
      <div className="preview-pane__scroll">
        <article className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkPageBreak]} skipHtml>
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  )
}
