import {
  PRINT_THEME_OPTIONS,
  type PrintThemeId,
  isPrintThemeId,
} from '../lib/printTheme'

type AppHeaderProps = {
  filename: string
  canPrint: boolean
  printTheme: PrintThemeId
  fontSize: number
  canDecreaseFontSize: boolean
  canIncreaseFontSize: boolean
  onFilenameChange: (filename: string) => void
  onPrintThemeChange: (theme: PrintThemeId) => void
  onDecreaseFontSize: () => void
  onIncreaseFontSize: () => void
  onPrint: () => void
}

export function AppHeader({
  filename,
  canPrint,
  printTheme,
  fontSize,
  canDecreaseFontSize,
  canIncreaseFontSize,
  onFilenameChange,
  onPrintThemeChange,
  onDecreaseFontSize,
  onIncreaseFontSize,
  onPrint,
}: AppHeaderProps) {
  return (
    <header className="app-header no-print">
      <div className="app-header__brand" aria-hidden="true">
        <span className="app-header__mark">M</span>
        <span className="app-header__brand-name">Markdownist</span>
      </div>
      <div className="app-header__divider" aria-hidden="true" />
      <div className="app-header__filename">
        <label htmlFor="filename-input" className="app-header__filename-label">
          파일명
        </label>
        <input
          id="filename-input"
          type="text"
          value={filename}
          onChange={(event) => onFilenameChange(event.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="app-header__theme">
        <label htmlFor="print-theme-select" className="app-header__theme-label">
          테마
        </label>
        <select
          id="print-theme-select"
          className="app-header__theme-select"
          aria-label="인쇄 테마"
          value={printTheme}
          onChange={(event) => {
            const next = event.target.value
            if (isPrintThemeId(next)) {
              onPrintThemeChange(next)
            }
          }}
        >
          {PRINT_THEME_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div
        className="app-header__font-size"
        role="group"
        aria-label="글자 크기"
      >
        <button
          type="button"
          className="app-header__font-size-button"
          onClick={onDecreaseFontSize}
          disabled={!canDecreaseFontSize}
          aria-label="글자 크기 줄이기"
        >
          A−
        </button>
        <span className="app-header__font-size-value" aria-live="polite">
          {fontSize}px
        </span>
        <button
          type="button"
          className="app-header__font-size-button"
          onClick={onIncreaseFontSize}
          disabled={!canIncreaseFontSize}
          aria-label="글자 크기 키우기"
        >
          A+
        </button>
      </div>
      <button
        type="button"
        className="app-header__print"
        onClick={onPrint}
        disabled={!canPrint}
      >
        <svg
          className="app-header__print-icon"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 5.5V2.75C4 2.336 4.336 2 4.75 2h6.5C11.664 2 12 2.336 12 2.75V5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 11.5H3.25C2.56 11.5 2 10.94 2 10.25v-3.5C2 6.06 2.56 5.5 3.25 5.5h9.5c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25H12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 9.5h8v4.75c0 .414-.336.75-.75.75h-6.5a.75.75 0 0 1-.75-.75V9.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M11.25 8h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        인쇄
      </button>
    </header>
  )
}
