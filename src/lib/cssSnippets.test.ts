import { describe, expect, it } from 'vitest'
import { appendCssSnippet } from './cssSnippets'

describe('appendCssSnippet', () => {
  it('adds a snippet to empty CSS', () => {
    expect(appendCssSnippet('', 'h1 {}\n')).toBe('h1 {}\n\n')
  })

  it('separates snippets with a blank line', () => {
    expect(appendCssSnippet('a {}\n', 'h1 {}\n')).toBe('a {}\n\nh1 {}\n\n')
  })
})
