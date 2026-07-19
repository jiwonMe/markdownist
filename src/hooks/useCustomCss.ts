import { useEffect, useState } from 'react'
import { loadCustomCss, saveCustomCss } from '../lib/customCss'

const SAVE_DELAY_MS = 300

export type UseCustomCssResult = {
  css: string
  setCss: (css: string) => void
}

export function useCustomCss(): UseCustomCssResult {
  const [css, setCss] = useState(() => loadCustomCss())

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveCustomCss(css)
    }, SAVE_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [css])

  return {
    css,
    setCss,
  }
}
