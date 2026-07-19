import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { EditorTab } from './components/EditorPane'
import { CUSTOM_CSS_STORAGE_KEY } from './lib/customCss'
import { DIRECTIVES_STORAGE_KEY } from './lib/directivesConfig'
import { DRAFT_STORAGE_KEY, DEFAULT_MARKDOWN } from './lib/draftStorage'
import { FONT_SIZE_STORAGE_KEY } from './lib/fontSize'
import { PRINT_THEME_STORAGE_KEY } from './lib/printTheme'

vi.mock('./components/EditorPane', () => ({
  EditorPane: ({
    filename,
    markdown,
    css,
    directivesJson,
    fontSize,
    activeTab,
    onTabChange,
    onMarkdownChange,
    onCssChange,
    onDirectivesChange,
  }: {
    filename: string
    markdown: string
    css: string
    directivesJson: string
    fontSize: number
    activeTab: EditorTab
    onTabChange: (tab: EditorTab) => void
    onMarkdownChange: (value: string) => void
    onCssChange: (value: string) => void
    onDirectivesChange: (value: string) => void
  }) => {
    const markdownLabel = filename.trim() || 'untitled.md'

    return (
      <section className="editor-pane no-print" aria-label="편집기">
        <div role="tablist" aria-label="편집 파일">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'markdown'}
            onClick={() => onTabChange('markdown')}
          >
            {markdownLabel}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'css'}
            onClick={() => onTabChange('css')}
          >
            style.css
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'directives'}
            onClick={() => onTabChange('directives')}
          >
            directives.json
          </button>
        </div>
        {activeTab === 'markdown' ? (
          <textarea
            aria-label="Markdown 편집기"
            data-fontsize={fontSize}
            value={markdown}
            onChange={(event) => onMarkdownChange(event.target.value)}
          />
        ) : null}
        {activeTab === 'css' ? (
          <>
            <div role="toolbar" aria-label="CSS 빠른 삽입">
              <select
                aria-label="테마를 style.css에 불러오기"
                defaultValue=""
                onChange={(event) => {
                  const value = event.target.value
                  event.target.value = ''
                  if (value === 'clean') {
                    onCssChange(
                      `${css.trimEnd()}\n\n/* Loaded theme: Clean */\n:scope {\n  --md-max-width: 680px;\n}\n`,
                    )
                  }
                }}
              >
                <option value="" disabled>
                  불러오기…
                </option>
                <option value="clean">Clean</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  onCssChange(`${css.trimEnd()}\n\nh1 {\n  color: tomato;\n}\n`)
                }
              >
                제목
              </button>
            </div>
            <textarea
              aria-label="CSS 편집기"
              data-fontsize={fontSize}
              value={css}
              onChange={(event) => onCssChange(event.target.value)}
            />
          </>
        ) : null}
        {activeTab === 'directives' ? (
          <textarea
            aria-label="directives.json 편집기"
            value={directivesJson}
            onChange={(event) => onDirectivesChange(event.target.value)}
          />
        ) : null}
      </section>
    )
  },
}))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    document.title = 'Markdownist'
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('syncs editor input into the preview', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = await screen.findByLabelText('Markdown 편집기')
    await user.clear(editor)
    await user.type(editor, '# Hello Preview')

    expect(
      await screen.findByRole('heading', { name: 'Hello Preview' }),
    ).toBeInTheDocument()
  })

  it('autosaves draft changes to localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    const filename = screen.getByLabelText('파일명')
    await user.clear(filename)
    await user.type(filename, 'saved.md')

    await waitFor(() => {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
      expect(raw).toBeTruthy()
      expect(JSON.parse(raw!)).toEqual(
        expect.objectContaining({
          filename: 'saved.md',
          markdown: DEFAULT_MARKDOWN,
        }),
      )
    })
  })

  it('disables print for an empty document', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = await screen.findByLabelText('Markdown 편집기')
    await user.clear(editor)

    expect(screen.getByRole('button', { name: '인쇄' })).toBeDisabled()
  })

  it('prints when content exists and restores the document title', async () => {
    const user = userEvent.setup()
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<App />)

    const filename = screen.getByLabelText('파일명')
    await user.clear(filename)
    await user.type(filename, 'report.md')

    await user.click(screen.getByRole('button', { name: '인쇄' }))

    expect(print).toHaveBeenCalledTimes(1)
    expect(document.title).toBe('report')

    act(() => {
      window.dispatchEvent(new Event('afterprint'))
    })
    expect(document.title).toBe('Markdownist')
  })

  it('increases and decreases shared font size', async () => {
    const user = userEvent.setup()
    render(<App />)

    const preview = screen.getByLabelText('미리보기')
    expect(preview).toHaveStyle({ '--preview-font-size': '16px' })
    expect(screen.getByText('16px')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '글자 크기 키우기' }))
    expect(preview).toHaveStyle({ '--preview-font-size': '18px' })
    expect(screen.getByText('18px')).toBeInTheDocument()

    const editor = await screen.findByLabelText('Markdown 편집기')
    expect(editor).toHaveAttribute('data-fontsize', '18')

    await waitFor(() => {
      expect(localStorage.getItem(FONT_SIZE_STORAGE_KEY)).toBe('18')
    })

    await user.click(screen.getByRole('button', { name: '글자 크기 줄이기' }))
    expect(preview).toHaveStyle({ '--preview-font-size': '16px' })
  })

  it('applies and persists the selected print theme', async () => {
    const user = userEvent.setup()
    render(<App />)

    const article = document.querySelector('.markdown-body')
    expect(article).toHaveAttribute('data-print-theme', 'classic')

    const themeSelect = screen.getByRole('combobox', { name: '인쇄 테마' })
    await user.selectOptions(themeSelect, 'academic')

    expect(article).toHaveAttribute('data-print-theme', 'academic')
    await waitFor(() => {
      expect(localStorage.getItem(PRINT_THEME_STORAGE_KEY)).toBe('academic')
    })
  })

  it('switches to style.css and injects custom CSS into the preview', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: 'style.css' }))
    await user.click(screen.getByRole('button', { name: '제목' }))

    await waitFor(() => {
      const styleTag = document.querySelector('[data-markdownist-custom-css]')
      expect(styleTag?.textContent).toContain('@scope (.markdown-body)')
      expect(styleTag?.textContent).toContain('color: tomato')
      expect(localStorage.getItem(CUSTOM_CSS_STORAGE_KEY)).toContain(
        'color: tomato',
      )
    })
  })

  it('appends a loaded print theme into style.css', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: 'style.css' }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: '테마를 style.css에 불러오기' }),
      'clean',
    )

    await waitFor(() => {
      const styleTag = document.querySelector('[data-markdownist-custom-css]')
      expect(styleTag?.textContent).toContain('Loaded theme: Clean')
      expect(styleTag?.textContent).toContain('--md-max-width: 680px')
      expect(localStorage.getItem(CUSTOM_CSS_STORAGE_KEY)).toContain(
        'Loaded theme: Clean',
      )
    })
  })

  it('persists directives.json edits', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: 'directives.json' }))
    const editor = await screen.findByLabelText('directives.json 편집기')
    await user.clear(editor)
    await user.paste(
      JSON.stringify(
        {
          version: 1,
          directives: [{ name: 'recipe', label: 'Recipe' }],
        },
        null,
        2,
      ),
    )

    await waitFor(() => {
      expect(localStorage.getItem(DIRECTIVES_STORAGE_KEY)).toContain('recipe')
    })
  })

  it('renders built-in directive callouts in the preview', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = await screen.findByLabelText('Markdown 편집기')
    await user.clear(editor)
    await user.paste(`:::warning[조심]
불 조심
:::`)

    expect(await screen.findByText('조심')).toBeInTheDocument()
    expect(screen.getByText('불 조심')).toBeInTheDocument()
    expect(document.querySelector('.md-directive--warning')).toBeTruthy()
  })
})
