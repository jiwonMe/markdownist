import { render } from '@testing-library/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { describe, expect, it } from 'vitest'
import { remarkMathToUpmath } from './remarkMathToUpmath'

function renderMarkdown(markdown: string) {
  return render(
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkMathToUpmath]}
      skipHtml
    >
      {markdown}
    </ReactMarkdown>,
  )
}

describe('remarkMathToUpmath', () => {
  it('does not turn a lone = inside display math into a setext heading', () => {
    const { container } = renderMarkdown(`$$
J_{ij}
=
\\frac{\\partial r_i}{\\partial x_j}.
$$`)

    expect(container.querySelector('h1')).toBeNull()
    expect(container.textContent).toContain('J_{ij}')
    expect(container.textContent).toContain(
      '\\frac{\\partial r_i}{\\partial x_j}.',
    )
    expect(container.textContent).toMatch(/\$\$[\s\S]*J_\{ij\}[\s\S]*\$\$/)
  })

  it('emits inline math as $$...$$ text (preserving underscores)', () => {
    const { container } = renderMarkdown('hello $J_{ij}$ world')

    expect(container.querySelector('em')).toBeNull()
    expect(container.textContent).toBe('hello $$J_{ij}$$ world')
  })
})
