import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DRAFT_STORAGE_KEY,
  DEFAULT_FILENAME,
  DEFAULT_MARKDOWN,
  createDefaultDraft,
  loadDraft,
  saveDraft,
  toPrintTitle,
} from './draftStorage'

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

describe('draftStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('restores a valid draft from storage', () => {
    const draft = {
      version: 1 as const,
      filename: 'notes.md',
      markdown: '# Hello',
      updatedAt: 123,
    }
    const storage = createMemoryStorage({
      [DRAFT_STORAGE_KEY]: JSON.stringify(draft),
    })

    expect(loadDraft(storage)).toEqual(draft)
  })

  it('falls back to defaults for corrupted data', () => {
    const storage = createMemoryStorage({
      [DRAFT_STORAGE_KEY]: '{not-json',
    })

    const draft = loadDraft(storage)
    expect(draft.filename).toBe(DEFAULT_FILENAME)
    expect(draft.markdown).toBe(DEFAULT_MARKDOWN)
    expect(draft.version).toBe(1)
  })

  it('falls back when storage is unavailable', () => {
    expect(loadDraft(null)).toEqual(
      expect.objectContaining({
        filename: DEFAULT_FILENAME,
        markdown: DEFAULT_MARKDOWN,
      }),
    )
  })

  it('saves a draft and returns true', () => {
    const storage = createMemoryStorage()
    const ok = saveDraft(
      { filename: 'print.md', markdown: 'body' },
      storage,
    )

    expect(ok).toBe(true)
    expect(JSON.parse(storage.getItem(DRAFT_STORAGE_KEY)!)).toEqual(
      expect.objectContaining({
        version: 1,
        filename: 'print.md',
        markdown: 'body',
      }),
    )
  })

  it('returns false when save fails', () => {
    const storage = createMemoryStorage()
    storage.setItem = () => {
      throw new Error('quota exceeded')
    }

    expect(saveDraft({ filename: 'a.md', markdown: 'x' }, storage)).toBe(false)
  })

  it('creates a default draft shape', () => {
    const draft = createDefaultDraft()
    expect(draft.filename).toBe(DEFAULT_FILENAME)
    expect(draft.markdown).toContain('Markdownist')
  })

  it('derives print titles from filenames', () => {
    expect(toPrintTitle('report.md')).toBe('report')
    expect(toPrintTitle('  ')).toBe('untitled')
    expect(toPrintTitle('.md')).toBe('untitled')
  })
})
