import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  expandInlineDollarMath,
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

describe('expandInlineDollarMath', () => {
  it('expands single-dollar inline math to $$...$$', () => {
    expect(expandInlineDollarMath('inline $E=mc^2$ here')).toBe(
      'inline $$E=mc^2$$ here',
    )
  })

  it('leaves display $$...$$ unchanged', () => {
    expect(expandInlineDollarMath('$$a+b$$')).toBe('$$a+b$$')
    expect(expandInlineDollarMath('before $$x$$ after')).toBe('before $$x$$ after')
  })

  it('does not treat unmatched or currency-like single $ as math', () => {
    expect(expandInlineDollarMath('costs $12')).toBe('costs $12')
    expect(expandInlineDollarMath('$')).toBe('$')
  })

  it('can mix inline $ and display $$ in one string', () => {
    expect(expandInlineDollarMath('see $x$ then $$y$$')).toBe(
      'see $$x$$ then $$y$$',
    )
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

  it('expands $...$ to $$...$$ before processTree', () => {
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
    root.innerHTML = '<p>inline $x^2$ here</p>'
    processMarkdownLatex(root)

    expect(seen.join('\0')).toContain('$$x^2$$')
    expect(seen.some((text) => text.includes('$x^2$') && !text.includes('$$x^2$$'))).toBe(
      false,
    )
  })

  it('masks $ inside code so processTree does not see them', () => {
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
      '<p>math $a$ and $$b$$</p><pre><code>keep $c$ and $$d$$ literal</code></pre>'
    processMarkdownLatex(root)

    const joined = seen.join('\0')
    expect(joined).toContain('$$a$$')
    expect(joined).toContain('$$b$$')
    expect(joined).not.toContain('$c$')
    expect(joined).not.toContain('$$d$$')
    expect(root.querySelector('code')?.textContent).toContain('$c$')
    expect(root.querySelector('code')?.textContent).toContain('$$d$$')
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
