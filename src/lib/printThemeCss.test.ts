import { describe, expect, it } from 'vitest'
import { PRINT_THEME_OPTIONS } from './printTheme'
import { formatPrintThemeAsCustomCss } from './printThemeCss'

describe('formatPrintThemeAsCustomCss', () => {
  it('exports every preset as a :scope token block', () => {
    for (const option of PRINT_THEME_OPTIONS) {
      const css = formatPrintThemeAsCustomCss(option.id)
      expect(css).toContain(`/* Loaded theme: ${option.label} */`)
      expect(css).toContain(':scope {')
      expect(css).toContain('--md-')
    }
  })

  it('includes extra element rules for Clean', () => {
    const css = formatPrintThemeAsCustomCss('clean')
    expect(css).toContain('th {')
    expect(css).toContain('border-bottom:')
  })
})
