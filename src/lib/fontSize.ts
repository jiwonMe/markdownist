export const FONT_SIZE_STORAGE_KEY = 'markdownist:fontSize:v1'

export const DEFAULT_FONT_SIZE = 16
export const MIN_FONT_SIZE = 12
export const MAX_FONT_SIZE = 28
export const FONT_SIZE_STEP = 2

export function clampFontSize(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_FONT_SIZE
  }

  const stepped =
    Math.round((value - DEFAULT_FONT_SIZE) / FONT_SIZE_STEP) * FONT_SIZE_STEP +
    DEFAULT_FONT_SIZE

  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, stepped))
}

export function loadFontSize(
  storage: Storage | null = getLocalStorage(),
): number {
  if (!storage) {
    return DEFAULT_FONT_SIZE
  }

  try {
    const raw = storage.getItem(FONT_SIZE_STORAGE_KEY)
    if (raw === null) {
      return DEFAULT_FONT_SIZE
    }

    return clampFontSize(Number(raw))
  } catch {
    return DEFAULT_FONT_SIZE
  }
}

export function saveFontSize(
  fontSize: number,
  storage: Storage | null = getLocalStorage(),
): boolean {
  if (!storage) {
    return false
  }

  try {
    storage.setItem(FONT_SIZE_STORAGE_KEY, String(clampFontSize(fontSize)))
    return true
  } catch {
    return false
  }
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof globalThis.localStorage === 'undefined') {
      return null
    }
    return globalThis.localStorage
  } catch {
    return null
  }
}
