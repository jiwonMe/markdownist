import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { wrapCustomCssForPreview } from '../lib/customCss'
import type { PrintThemeId } from '../lib/printTheme'
import { remarkPageBreak } from '../lib/remarkPageBreak'

type MarkdownPreviewProps = {
  markdown: string
  fontSize: number
  printTheme: PrintThemeId
  customCss: string
}

export function MarkdownPreview({
  markdown,
  fontSize,
  printTheme,
  customCss,
}: MarkdownPreviewProps) {
  const style = {
    '--preview-font-size': `${fontSize}px`,
  } as CSSProperties
  const scopedCss = wrapCustomCssForPreview(customCss)

  return (
    <section className="preview-pane" aria-label="미리보기" style={style}>
      {scopedCss ? (
        <style data-markdownist-custom-css>{scopedCss}</style>
      ) : null}
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
