import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CUSTOM_CSS_STORAGE_KEY,
  DEFAULT_CUSTOM_CSS,
  loadCustomCss,
  saveCustomCss,
  wrapCustomCssForPreview,
} from './customCss'

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

describe('customCss', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads default CSS when storage is empty', () => {
    expect(loadCustomCss(createMemoryStorage())).toBe(DEFAULT_CUSTOM_CSS)
  })

  it('loads and saves custom CSS as a plain string', () => {
    const storage = createMemoryStorage()
    const css = 'h1 { color: tomato; }\n'
    expect(saveCustomCss(css, storage)).toBe(true)
    expect(storage.getItem(CUSTOM_CSS_STORAGE_KEY)).toBe(css)
    expect(loadCustomCss(storage)).toBe(css)
  })

  it('wraps non-empty CSS in @scope for the preview document', () => {
    expect(wrapCustomCssForPreview('')).toBe('')
    expect(wrapCustomCssForPreview('   ')).toBe('')
    expect(wrapCustomCssForPreview('h1 { color: red; }')).toBe(
      `@scope (.markdown-body) {\nh1 { color: red; }\n}`,
    )
  })
})
