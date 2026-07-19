import { render, screen } from '@testing-library/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { describe, expect, it } from 'vitest'
import { remarkPageBreak } from './remarkPageBreak'

function renderMarkdown(markdown: string) {
  return render(
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkPageBreak]} skipHtml>
      {markdown}
    </ReactMarkdown>,
  )
}

describe('remarkPageBreak', () => {
  it('converts a horizontal rule into a page-break element', () => {
    const { container } = renderMarkdown('Before\n\n---\n\nAfter')

    const pageBreak = container.querySelector('.page-break')
    expect(pageBreak).not.toBeNull()
    expect(pageBreak?.tagName).toBe('DIV')
    expect(container.querySelector('hr')).toBeNull()
    expect(container.textContent).toContain('Before')
    expect(container.textContent).toContain('After')
  })

  it('converts a standalone pagebreak comment into a page-break element', () => {
    const { container } = renderMarkdown(
      'Before\n\n<!-- pagebreak -->\n\nAfter',
    )

    const pageBreak = container.querySelector('.page-break')
    expect(pageBreak).not.toBeNull()
    expect(pageBreak?.tagName).toBe('DIV')
    expect(container.textContent).toContain('Before')
    expect(container.textContent).toContain('After')
  })

  it('does not treat table separators as page breaks', () => {
    const { container } = renderMarkdown(
      '| 기능 | 지원 |\n| --- | --- |\n| 표 | 예 |',
    )

    expect(container.querySelector('.page-break')).toBeNull()
    expect(container.querySelector('table')).not.toBeNull()
  })

  it('does not convert a pagebreak marker inside a code block', () => {
    const { container } = renderMarkdown(
      '```\n---\n<!-- pagebreak -->\n```\n\nVisible',
    )

    expect(container.querySelector('.page-break')).toBeNull()
    expect(container.querySelector('code')?.textContent).toContain('---')
    expect(screen.getByText('Visible')).toBeInTheDocument()
  })

  it('does not execute arbitrary raw HTML', () => {
    const { container } = renderMarkdown(
      'Safe\n\n<div data-testid="raw-html">injected</div>\n\n---',
    )

    expect(container.querySelector('[data-testid="raw-html"]')).toBeNull()
    expect(container.querySelector('.page-break')).not.toBeNull()
    expect(container.textContent).not.toContain('injected')
  })
})
