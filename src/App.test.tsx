import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { DRAFT_STORAGE_KEY, DEFAULT_MARKDOWN } from './lib/draftStorage'
import { FONT_SIZE_STORAGE_KEY } from './lib/fontSize'
import { PRINT_THEME_STORAGE_KEY } from './lib/printTheme'

vi.mock('./components/MarkdownEditor', () => ({
  MarkdownEditor: ({
    value,
    fontSize,
    onChange,
  }: {
    value: string
    fontSize: number
    onChange: (value: string) => void
  }) => (
    <textarea
      aria-label="Markdown 편집기"
      data-fontsize={fontSize}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
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
})
