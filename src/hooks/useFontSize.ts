import { useEffect, useState } from 'react'
import {
  FONT_SIZE_STEP,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  clampFontSize,
  loadFontSize,
  saveFontSize,
} from '../lib/fontSize'

export type UseFontSizeResult = {
  fontSize: number
  canDecrease: boolean
  canIncrease: boolean
  decreaseFontSize: () => void
  increaseFontSize: () => void
}

export function useFontSize(): UseFontSizeResult {
  const [fontSize, setFontSize] = useState(() => loadFontSize())

  useEffect(() => {
    saveFontSize(fontSize)
  }, [fontSize])

  return {
    fontSize,
    canDecrease: fontSize > MIN_FONT_SIZE,
    canIncrease: fontSize < MAX_FONT_SIZE,
    decreaseFontSize: () => {
      setFontSize((current) => clampFontSize(current - FONT_SIZE_STEP))
    },
    increaseFontSize: () => {
      setFontSize((current) => clampFontSize(current + FONT_SIZE_STEP))
    },
  }
}
