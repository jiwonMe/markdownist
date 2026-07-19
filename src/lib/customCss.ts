export const CUSTOM_CSS_STORAGE_KEY = 'markdownist:custom-css:v1'

export const DEFAULT_CUSTOM_CSS = `/* style.css — 미리보기/인쇄 문서에만 적용됩니다.
 * Ctrl/Cmd+Space 로 선택자·토큰 자동완성
 * 위 칩(제목, 본문, aside…)으로 자주 쓰는 블록을 넣을 수 있습니다.
 *
 * 토큰 예: --md-line-height, --md-max-width, --md-link
 * 선택자 예: h1, p, a, code, pre, blockquote, table, :scope
 * Directive: .md-directive--aside, .md-directive--note, .md-directive__label
 */

:scope {
  /* --md-line-height: 1.75; */
  /* --md-max-width: 680px; */
}

/* h1 {
  letter-spacing: -0.03em;
} */
`

export function loadCustomCss(
  storage: Storage | null = getLocalStorage(),
): string {
  if (!storage) {
    return DEFAULT_CUSTOM_CSS
  }

  try {
    const raw = storage.getItem(CUSTOM_CSS_STORAGE_KEY)
    if (raw === null) {
      return DEFAULT_CUSTOM_CSS
    }
    return raw
  } catch {
    return DEFAULT_CUSTOM_CSS
  }
}

export function saveCustomCss(
  css: string,
  storage: Storage | null = getLocalStorage(),
): boolean {
  if (!storage) {
    return false
  }

  try {
    storage.setItem(CUSTOM_CSS_STORAGE_KEY, css)
    return true
  } catch {
    return false
  }
}

/** Scope user CSS to the preview document so app chrome stays untouched. */
export function wrapCustomCssForPreview(css: string): string {
  const trimmed = css.trim()
  if (!trimmed) {
    return ''
  }

  return `@scope (.markdown-body) {\n${css}\n}`
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
