type AppHeaderProps = {
  filename: string
  canPrint: boolean
  fontSize: number
  canDecreaseFontSize: boolean
  canIncreaseFontSize: boolean
  onFilenameChange: (filename: string) => void
  onDecreaseFontSize: () => void
  onIncreaseFontSize: () => void
  onPrint: () => void
}

export function AppHeader({
  filename,
  canPrint,
  fontSize,
  canDecreaseFontSize,
  canIncreaseFontSize,
  onFilenameChange,
  onDecreaseFontSize,
  onIncreaseFontSize,
  onPrint,
}: AppHeaderProps) {
  return (
    <header className="app-header no-print">
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
        인쇄
      </button>
    </header>
  )
}
