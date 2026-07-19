import { toPrintTitle } from './draftStorage'

export function requestPrint(filename: string): void {
  const previousTitle = document.title
  const nextTitle = toPrintTitle(filename)

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
