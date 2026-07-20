import { describe, expect, it } from 'vitest'
import { normalizeLatexDelimiters } from './normalizeLatexDelimiters'

describe('normalizeLatexDelimiters', () => {
  it('converts \\[...\\] display math to $$...$$', () => {
    expect(
      normalizeLatexDelimiters(`\\[
J_{ij}
=
x
\\]`),
    ).toBe(`$$
J_{ij}
=
x
$$`)
  })

  it('converts \\(...\\) inline math to $...$', () => {
    expect(normalizeLatexDelimiters('see \\(E=mc^2\\) here')).toBe(
      'see $E=mc^2$ here',
    )
  })

  it('leaves code fences and inline code alone', () => {
    const source = 'keep `\\(x\\)` and:\n```\n\\[y\\]\n```\n'
    expect(normalizeLatexDelimiters(source)).toBe(source)
  })

  it('does not alter existing $ / $$ math', () => {
    expect(normalizeLatexDelimiters('inline $a$ and $$b$$')).toBe(
      'inline $a$ and $$b$$',
    )
  })
})
