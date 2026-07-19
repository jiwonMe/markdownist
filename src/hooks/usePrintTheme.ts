import { useEffect, useState } from 'react'
import {
  type PrintThemeId,
  loadPrintTheme,
  savePrintTheme,
} from '../lib/printTheme'

export type UsePrintThemeResult = {
  theme: PrintThemeId
  setTheme: (theme: PrintThemeId) => void
}

export function usePrintTheme(): UsePrintThemeResult {
  const [theme, setTheme] = useState<PrintThemeId>(() => loadPrintTheme())

  useEffect(() => {
    savePrintTheme(theme)
  }, [theme])

  return {
    theme,
    setTheme,
  }
}
