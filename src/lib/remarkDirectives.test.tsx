import { render, screen } from '@testing-library/react'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import { describe, expect, it } from 'vitest'
import { remarkDirectives } from './remarkDirectives'

function renderMarkdown(markdown: string) {
  return render(
    <ReactMarkdown
      remarkPlugins={[remarkDirective, remarkDirectives]}
      skipHtml
      components={{
        aside: ({ children, ...props }) => {
          const name = (props as { 'data-directive'?: string })[
            'data-directive'
          ]
          const label = (props as { 'data-label'?: string })['data-label']
          if (!name) {
            return <aside {...props}>{children}</aside>
          }
          return (
            <aside data-testid={`directive-${name}`} data-label={label}>
              {children}
            </aside>
          )
        },
      }}
    >
      {markdown}
    </ReactMarkdown>,
  )
}

describe('remarkDirectives', () => {
  it('renders container directives with labels', () => {
    renderMarkdown(`:::note[주의]
본문
:::`)
    const node = screen.getByTestId('directive-note')
    expect(node).toHaveAttribute('data-label', '주의')
    expect(node).toHaveTextContent('본문')
  })
})
