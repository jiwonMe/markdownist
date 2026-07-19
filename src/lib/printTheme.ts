export type PrintThemeId =
  | 'classic'
  | 'clean'
  | 'compact'
  | 'report'
  | 'academic'
  | 'memo'
  | 'resume'
  | 'blog'

export const PRINT_THEME_STORAGE_KEY = 'markdownist:print-theme:v1'

export const DEFAULT_PRINT_THEME: PrintThemeId = 'classic'

export const PRINT_THEME_OPTIONS: { id: PrintThemeId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'clean', label: 'Clean' },
  { id: 'compact', label: 'Compact' },
  { id: 'report', label: 'Report' },
  { id: 'academic', label: 'Academic' },
  { id: 'memo', label: 'Memo' },
  { id: 'resume', label: 'Resume' },
  { id: 'blog', label: 'Blog' },
]

const PRINT_THEME_IDS = new Set<string>(
  PRINT_THEME_OPTIONS.map((option) => option.id),
)

export function isPrintThemeId(value: unknown): value is PrintThemeId {
  return typeof value === 'string' && PRINT_THEME_IDS.has(value)
}

export function loadPrintTheme(
  storage: Storage | null = getLocalStorage(),
): PrintThemeId {
  if (!storage) {
    return DEFAULT_PRINT_THEME
  }

  try {
    const raw = storage.getItem(PRINT_THEME_STORAGE_KEY)
    if (raw === null || raw === '') {
      return DEFAULT_PRINT_THEME
    }

    return isPrintThemeId(raw) ? raw : DEFAULT_PRINT_THEME
  } catch {
    return DEFAULT_PRINT_THEME
  }
}

export function savePrintTheme(
  theme: PrintThemeId,
  storage: Storage | null = getLocalStorage(),
): boolean {
  if (!storage || !isPrintThemeId(theme)) {
    return false
  }

  try {
    storage.setItem(PRINT_THEME_STORAGE_KEY, theme)
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
