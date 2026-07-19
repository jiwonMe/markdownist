import { describe, expect, it } from 'vitest'
import {
  appendCssSnippet,
  formatDirectiveAsCustomCss,
  listDirectiveCssSnippets,
} from './cssSnippets'

describe('appendCssSnippet', () => {
  it('adds a snippet to empty CSS', () => {
    expect(appendCssSnippet('', 'h1 {}\n')).toBe('h1 {}\n\n')
  })

  it('separates snippets with a blank line', () => {
    expect(appendCssSnippet('a {}\n', 'h1 {}\n')).toBe('a {}\n\nh1 {}\n\n')
  })
})

describe('listDirectiveCssSnippets', () => {
  it('includes builtins and user directives', () => {
    const snippets = listDirectiveCssSnippets({
      version: 1,
      directives: [{ name: 'aside', label: 'Aside' }],
    })

    expect(snippets.map((item) => item.label)).toEqual([
      'note',
      'tip',
      'warning',
      'important',
      'aside',
    ])
    expect(snippets.at(-1)?.code).toContain('.md-directive--aside')
  })

  it('formats known directive colors', () => {
    expect(formatDirectiveAsCustomCss('tip')).toContain('oklch(0.55 0.14 150)')
  })
})
