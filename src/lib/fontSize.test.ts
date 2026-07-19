import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_FONT_SIZE,
  FONT_SIZE_STORAGE_KEY,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  clampFontSize,
  loadFontSize,
  saveFontSize,
} from './fontSize'

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

describe('fontSize', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('clamps and steps font sizes', () => {
    expect(clampFontSize(16)).toBe(DEFAULT_FONT_SIZE)
    expect(clampFontSize(17)).toBe(18)
    expect(clampFontSize(18)).toBe(18)
    expect(clampFontSize(MIN_FONT_SIZE - 4)).toBe(MIN_FONT_SIZE)
    expect(clampFontSize(MAX_FONT_SIZE + 4)).toBe(MAX_FONT_SIZE)
  })

  it('loads and saves font size', () => {
    const storage = createMemoryStorage()
    expect(saveFontSize(20, storage)).toBe(true)
    expect(storage.getItem(FONT_SIZE_STORAGE_KEY)).toBe('20')
    expect(loadFontSize(storage)).toBe(20)
  })

  it('falls back for invalid stored values', () => {
    const storage = createMemoryStorage({
      [FONT_SIZE_STORAGE_KEY]: 'not-a-number',
    })
    expect(loadFontSize(storage)).toBe(DEFAULT_FONT_SIZE)
  })
})
