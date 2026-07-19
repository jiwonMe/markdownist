import { DEFAULT_FONT_SIZE } from './fontSize'

export const UPMATH_LATEX_SCRIPT_SRC = 'https://i.upmath.me/latex.js'

export const LATEX_IMAGE_WAIT_TIMEOUT_MS = 8000

/**
 * Upmath sizes formulas with `calc(var(--latex-zoom) * Npt)`.
 * Track the preview font size so math scales with the ± controls (16px → 1).
 */
export function latexZoomForFontSize(fontSize: number): number {
  if (!Number.isFinite(fontSize) || fontSize <= 0) {
    return 1
  }
  return fontSize / DEFAULT_FONT_SIZE
}

const CODE_DOLLAR_MASK = '\uE000'

type S2LatexApi = {
  processTree: (root: ParentNode) => void
}

declare global {
  interface Window {
    S2Latex?: S2LatexApi
  }
}

let loadPromise: Promise<void> | null = null

export function loadUpmathLatex(
  doc: Document = document,
): Promise<void> {
  if (typeof window !== 'undefined' && window.S2Latex) {
    return Promise.resolve()
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined' && window.S2Latex) {
      resolve()
      return
    }

    const existing = doc.querySelector<HTMLScriptElement>(
      `script[src="${UPMATH_LATEX_SCRIPT_SRC}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load Upmath latex.js')),
        { once: true },
      )
      if (window.S2Latex) {
        resolve()
      }
      return
    }

    const script = doc.createElement('script')
    script.src = UPMATH_LATEX_SCRIPT_SRC
    script.async = true
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => {
        loadPromise = null
        reject(new Error('Failed to load Upmath latex.js'))
      },
      { once: true },
    )
    doc.head.appendChild(script)
  })

  return loadPromise
}

function maskDollarsInCode(root: HTMLElement): Array<{
  node: Text
  value: string
}> {
  const masked: Array<{ node: Text; value: string }> = []
  const scopes = root.querySelectorAll('pre, code')

  for (const scope of scopes) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT)
    let current = walker.nextNode()
    while (current) {
      const textNode = current as Text
      const value = textNode.nodeValue
      if (value && value.includes('$$')) {
        masked.push({ node: textNode, value })
        textNode.nodeValue = value.split('$$').join(CODE_DOLLAR_MASK + CODE_DOLLAR_MASK)
      }
      current = walker.nextNode()
    }
  }

  return masked
}

function restoreMaskedDollars(
  masked: Array<{ node: Text; value: string }>,
): void {
  for (const { node, value } of masked) {
    if (node.parentNode) {
      node.nodeValue = value
    }
  }
}

/** Run Upmath replacement on preview markdown; leave fenced/inline code alone. */
export function processMarkdownLatex(root: HTMLElement): void {
  const api = typeof window !== 'undefined' ? window.S2Latex : undefined
  if (!api) {
    return
  }

  const masked = maskDollarsInCode(root)
  try {
    api.processTree(root)
  } finally {
    restoreMaskedDollars(masked)
  }
}

function whenImageSettled(img: HTMLImageElement): Promise<void> {
  if (img.complete) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener('load', done)
      img.removeEventListener('error', done)
      resolve()
    }
    img.addEventListener('load', done)
    img.addEventListener('error', done)
  })
}

/** Wait until Upmath formula images settle, or until timeout. */
export function waitForLatexImages(
  root: ParentNode,
  timeoutMs: number = LATEX_IMAGE_WAIT_TIMEOUT_MS,
): Promise<void> {
  const images = [
    ...root.querySelectorAll<HTMLImageElement>('img.latex-svg, img.latex-png'),
  ]

  if (images.length === 0) {
    return Promise.resolve()
  }

  return Promise.race([
    Promise.all(images.map(whenImageSettled)).then(() => undefined),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs)
    }),
  ])
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let pendingRoot: HTMLElement | null = null

/** Debounced preview processing (typing). */
export function scheduleMarkdownLatex(
  root: HTMLElement,
  delayMs = 300,
): void {
  pendingRoot = root
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    const target = pendingRoot
    pendingRoot = null
    if (target) {
      processMarkdownLatex(target)
    }
  }, delayMs)
}

/** Flush pending debounce and process immediately (print). */
export function flushMarkdownLatex(root?: HTMLElement | null): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  const target = root ?? pendingRoot
  pendingRoot = null
  if (target) {
    processMarkdownLatex(target)
  }
}
