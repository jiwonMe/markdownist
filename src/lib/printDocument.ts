import { toPrintTitle } from './draftStorage'
import {
  flushMarkdownLatex,
  waitForLatexImages,
} from './upmathLatex'

function getPreviewMarkdownBody(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.markdown-body')
}

export async function requestPrint(filename: string): Promise<void> {
  const previousTitle = document.title
  const nextTitle = toPrintTitle(filename)
  const preview = getPreviewMarkdownBody()

  if (preview) {
    flushMarkdownLatex(preview)
    await waitForLatexImages(preview)
  }

  const restoreTitle = () => {
    document.title = previousTitle
    window.removeEventListener('beforeprint', applyTitle)
    window.removeEventListener('afterprint', restoreTitle)
  }

  const applyTitle = () => {
    document.title = nextTitle
  }

  window.addEventListener('beforeprint', applyTitle)
  window.addEventListener('afterprint', restoreTitle)
  applyTitle()
  window.print()
}
