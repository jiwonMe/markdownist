import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestPrint } from './printDocument'

describe('requestPrint', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.title = 'Markdownist'
  })

  it('sets the document title from the filename and calls window.print', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    document.title = 'Markdownist'

    requestPrint('chapter-1.md')

    expect(document.title).toBe('chapter-1')
    expect(print).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new Event('afterprint'))
    expect(document.title).toBe('Markdownist')
  })
})
