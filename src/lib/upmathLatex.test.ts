import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  flushMarkdownLatex,
  latexZoomForFontSize,
  processMarkdownLatex,
  scheduleMarkdownLatex,
  waitForLatexImages,
} from './upmathLatex'

describe('latexZoomForFontSize', () => {
  it('tracks preview font size (16px → 1)', () => {
    expect(latexZoomForFontSize(16)).toBe(1)
    expect(latexZoomForFontSize(24)).toBe(1.5)
    expect(latexZoomForFontSize(12)).toBe(0.75)
  })
})

describe('processMarkdownLatex', () => {
  afterEach(() => {
    delete window.S2Latex
  })

  it('calls S2Latex.processTree on the root', () => {
    const processTree = vi.fn()
    window.S2Latex = { processTree }

    const root = document.createElement('div')
    root.innerHTML = '<p>inline $$x^2$$ here</p>'
    processMarkdownLatex(root)

    expect(processTree).toHaveBeenCalledWith(root)
  })

  it('masks $$ inside code so processTree does not see them', () => {
    const seen: string[] = []
    window.S2Latex = {
      processTree(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        let node = walker.nextNode()
        while (node) {
          seen.push(node.nodeValue ?? '')
          node = walker.nextNode()
        }
      },
    }

    const root = document.createElement('div')
    root.innerHTML =
      '<p>math $$a$$</p><pre><code>keep $$b$$ literal</code></pre>'
    processMarkdownLatex(root)

    expect(seen.some((text) => text.includes('$$a$$') || text.includes('a'))).toBe(
      true,
    )
    expect(seen.join('\0')).not.toContain('$$b$$')
    expect(root.querySelector('code')?.textContent).toContain('$$b$$')
  })
})

describe('waitForLatexImages', () => {
  it('resolves immediately when there are no latex images', async () => {
    const root = document.createElement('div')
    await expect(waitForLatexImages(root, 50)).resolves.toBeUndefined()
  })

  it('waits until images complete', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.className = 'latex-svg'
    Object.defineProperty(img, 'complete', { configurable: true, get: () => false })
    root.appendChild(img)

    let settled = false
    const waiting = waitForLatexImages(root, 2000).then(() => {
      settled = true
    })

    expect(settled).toBe(false)
    img.dispatchEvent(new Event('load'))
    await waiting
    expect(settled).toBe(true)
  })

  it('resolves on timeout', async () => {
    vi.useFakeTimers()
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.className = 'latex-png'
    Object.defineProperty(img, 'complete', { get: () => false })
    root.appendChild(img)

    const waiting = waitForLatexImages(root, 100)
    await vi.advanceTimersByTimeAsync(100)
    await expect(waiting).resolves.toBeUndefined()
    vi.useRealTimers()
  })
})

describe('scheduleMarkdownLatex / flushMarkdownLatex', () => {
  afterEach(() => {
    delete window.S2Latex
    vi.useRealTimers()
  })

  it('debounces then processes', async () => {
    vi.useFakeTimers()
    const processTree = vi.fn()
    window.S2Latex = { processTree }

    const root = document.createElement('div')
    root.innerHTML = '<p>$$1$$</p>'
    scheduleMarkdownLatex(root, 300)
    scheduleMarkdownLatex(root, 300)
    expect(processTree).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(300)
    expect(processTree).toHaveBeenCalledTimes(1)
  })

  it('flush runs immediately', () => {
    vi.useFakeTimers()
    const processTree = vi.fn()
    window.S2Latex = { processTree }

    const root = document.createElement('div')
    scheduleMarkdownLatex(root, 300)
    flushMarkdownLatex(root)
    expect(processTree).toHaveBeenCalledTimes(1)
  })
})
