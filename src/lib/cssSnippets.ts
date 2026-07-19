export type CssSnippet = {
  id: string
  label: string
  detail: string
  code: string
}

/** Quick-insert chips shown above the CSS editor. */
export const CSS_QUICK_SNIPPETS: CssSnippet[] = [
  {
    id: 'heading',
    label: '제목',
    detail: 'h1 / h2',
    code: `h1 {
  letter-spacing: -0.03em;
}

h2 {
  margin-top: 1.6em;
}
`,
  },
  {
    id: 'body',
    label: '본문',
    detail: '줄간격·폭',
    code: `:scope {
  --md-line-height: 1.75;
  --md-max-width: 680px;
}
`,
  },
  {
    id: 'link',
    label: '링크',
    detail: 'a',
    code: `a {
  color: oklch(0.45 0.16 260);
  text-decoration: underline;
  text-underline-offset: 2px;
}
`,
  },
  {
    id: 'code',
    label: '코드',
    detail: 'code / pre',
    code: `code {
  font-size: 0.9em;
}

pre {
  padding: 16px;
  border-radius: 8px;
}
`,
  },
  {
    id: 'quote',
    label: '인용',
    detail: 'blockquote',
    code: `blockquote {
  padding-left: 1em;
  border-left: 3px solid oklch(0 0 0 / 0.16);
  color: oklch(0.45 0.02 260);
}
`,
  },
  {
    id: 'table',
    label: '표',
    detail: 'table',
    code: `th {
  background: oklch(0.96 0.01 260);
  font-weight: 600;
}

td,
th {
  padding: 8px 12px;
}
`,
  },
]

/** Monaco completion snippets (prefix → expand). */
export const CSS_EDITOR_SNIPPETS: Array<{
  label: string
  insertText: string
  detail: string
}> = [
  {
    label: 'md-tokens',
    detail: '문서 토큰 오버라이드',
    insertText: `:scope {
  --md-font-body: var(--font-body);
  --md-line-height: 1.7;
  --md-max-width: 720px;
  --md-link: oklch(0.48 0.18 260);
}`,
  },
  {
    label: 'md-h1',
    detail: 'h1 스타일',
    insertText: `h1 {
  font-size: 2em;
  letter-spacing: -0.03em;
}`,
  },
  {
    label: 'md-blockquote',
    detail: '인용문',
    insertText: `blockquote {
  border-left: 3px solid oklch(0 0 0 / 0.16);
  padding-left: 1em;
}`,
  },
  {
    label: 'md-pre',
    detail: '코드 블록',
    insertText: `pre {
  padding: 16px;
  border-radius: 8px;
  background: oklch(0.97 0.004 260);
}`,
  },
]

export const CSS_VARIABLE_SUGGESTIONS = [
  '--md-font-body',
  '--md-font-heading',
  '--md-font-heading-weight',
  '--md-letter-spacing-heading',
  '--md-line-height',
  '--md-block-gap',
  '--md-max-width',
  '--md-h1-size',
  '--md-h2-size',
  '--md-h3-size',
  '--md-link',
  '--md-link-hover',
  '--md-code-bg',
  '--md-code-border',
  '--md-code-radius',
  '--md-pre-bg',
  '--md-pre-border',
  '--md-pre-radius',
  '--md-quote-border',
  '--md-quote-fg',
  '--md-quote-bg',
  '--md-table-border',
  '--md-table-header-bg',
  '--md-table-cell-pad',
  '--md-hr',
  '--md-img-radius',
  '--md-heading-rule',
  '--preview-font-size',
] as const

export function appendCssSnippet(current: string, snippet: string): string {
  const base = current.trimEnd()
  if (base.length === 0) {
    return `${snippet}\n`
  }
  return `${base}\n\n${snippet}\n`
}
