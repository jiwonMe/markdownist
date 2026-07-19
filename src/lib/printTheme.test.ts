import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_PRINT_THEME,
  PRINT_THEME_STORAGE_KEY,
  isPrintThemeId,
  loadPrintTheme,
  savePrintTheme,
} from './printTheme'

function createMemoryStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial))

  return {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null
    },
    removeItem(key: string) {
      map.delete(key)
    },
    setItem(key: string, value: string) {
      map.set(key, value)
    },
  }
}

describe('printTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('recognizes known theme ids', () => {
    expect(isPrintThemeId('classic')).toBe(true)
    expect(isPrintThemeId('clean')).toBe(true)
    expect(isPrintThemeId('compact')).toBe(true)
    expect(isPrintThemeId('report')).toBe(true)
    expect(isPrintThemeId('unknown')).toBe(false)
    expect(isPrintThemeId(1)).toBe(false)
  })

  it('loads and saves theme id as a plain string', () => {
    const storage = createMemoryStorage()
    expect(savePrintTheme('clean', storage)).toBe(true)
    expect(storage.getItem(PRINT_THEME_STORAGE_KEY)).toBe('clean')
    expect(loadPrintTheme(storage)).toBe('clean')
  })

  it('falls back to classic for missing or unknown values', () => {
    expect(loadPrintTheme(createMemoryStorage())).toBe(DEFAULT_PRINT_THEME)
    expect(
      loadPrintTheme(
        createMemoryStorage({
          [PRINT_THEME_STORAGE_KEY]: '',
        }),
      ),
    ).toBe(DEFAULT_PRINT_THEME)
    expect(
      loadPrintTheme(
        createMemoryStorage({
          [PRINT_THEME_STORAGE_KEY]: 'neon',
        }),
      ),
    ).toBe(DEFAULT_PRINT_THEME)
  })
})
