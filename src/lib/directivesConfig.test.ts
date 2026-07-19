import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DIRECTIVES_JSON,
  parseDirectivesConfig,
  resolveDirectiveLabel,
} from './directivesConfig'

describe('directivesConfig', () => {
  it('parses the default directives JSON', () => {
    const { config, error } = parseDirectivesConfig(DEFAULT_DIRECTIVES_JSON)
    expect(error).toBeNull()
    expect(config.directives).toEqual([{ name: 'aside', label: 'Aside' }])
  })

  it('rejects invalid names and builtin clashes', () => {
    expect(
      parseDirectivesConfig(
        JSON.stringify({
          version: 1,
          directives: [{ name: 'Note', label: 'X' }],
        }),
      ).error,
    ).toMatch(/소문자/)

    expect(
      parseDirectivesConfig(
        JSON.stringify({
          version: 1,
          directives: [{ name: 'note', label: 'Dup' }],
        }),
      ).error,
    ).toMatch(/빌트인/)
  })

  it('resolves labels from builtins, config, and explicit labels', () => {
    const config = {
      version: 1 as const,
      directives: [{ name: 'aside', label: 'Aside' }],
    }
    expect(resolveDirectiveLabel('tip', config)).toBe('Tip')
    expect(resolveDirectiveLabel('aside', config)).toBe('Aside')
    expect(resolveDirectiveLabel('aside', config, '메모')).toBe('메모')
  })
})
