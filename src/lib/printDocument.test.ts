import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestPrint } from './printDocument'

vi.mock('./upmathLatex', () => ({
  flushMarkdownLatex: vi.fn(),
  waitForLatexImages: vi.fn(() => Promise.resolve()),
}))

describe('requestPrint', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.title = 'Markdownist'
    document.body.innerHTML = ''
  })

  it('sets the document title from the filename and calls window.print', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    document.title = 'Markdownist'
    document.body.innerHTML = '<article class="markdown-body"></article>'

    await requestPrint('chapter-1.md')

    expect(document.title).toBe('chapter-1')
    expect(print).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new Event('afterprint'))
    expect(document.title).toBe('Markdownist')
  })

  it('flushes latex and waits for images before printing', async () => {
    const { flushMarkdownLatex, waitForLatexImages } = await import(
      './upmathLatex'
    )
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    document.body.innerHTML = '<article class="markdown-body"></article>'

    let release!: () => void
    vi.mocked(waitForLatexImages).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = resolve
        }),
    )

    const pending = requestPrint('math.md')
    expect(flushMarkdownLatex).toHaveBeenCalled()
    expect(print).not.toHaveBeenCalled()

    release()
    await pending
    expect(print).toHaveBeenCalledTimes(1)
  })
})
