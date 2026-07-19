import type { CSSProperties, ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { wrapCustomCssForPreview } from '../lib/customCss'
import type { DirectivesConfig } from '../lib/directivesConfig'
import type { PrintThemeId } from '../lib/printTheme'
import { remarkDirectives } from '../lib/remarkDirectives'
import { remarkPageBreak } from '../lib/remarkPageBreak'
import { DirectiveBlock } from './DirectiveBlock'

type MarkdownPreviewProps = {
  markdown: string
  fontSize: number
  printTheme: PrintThemeId
  customCss: string
  directivesConfig: DirectivesConfig
}

type AsideProps = ComponentPropsWithoutRef<'aside'> & {
  'data-directive'?: string
  'data-label'?: string
}

type SpanProps = ComponentPropsWithoutRef<'span'> & {
  'data-directive'?: string
  'data-label'?: string
}

export function MarkdownPreview({
  markdown,
  fontSize,
  printTheme,
  customCss,
  directivesConfig,
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
          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              remarkDirective,
              remarkDirectives,
              remarkPageBreak,
            ]}
            skipHtml
            components={{
              aside: ({ children, className, ...props }: AsideProps) => {
                const name = props['data-directive']
                if (!name) {
                  return (
                    <aside className={className} {...props}>
                      {children}
                    </aside>
                  )
                }

                return (
                  <DirectiveBlock
                    name={name}
                    label={props['data-label']}
                    config={directivesConfig}
                    className={className}
                  >
                    {children}
                  </DirectiveBlock>
                )
              },
              span: ({ children, className, ...props }: SpanProps) => {
                const name = props['data-directive']
                if (!name) {
                  return (
                    <span className={className} {...props}>
                      {children}
                    </span>
                  )
                }

                return (
                  <DirectiveBlock
                    name={name}
                    label={props['data-label']}
                    inline
                    config={directivesConfig}
                    className={className}
                  >
                    {children}
                  </DirectiveBlock>
                )
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  )
}
