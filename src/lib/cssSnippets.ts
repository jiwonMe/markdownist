import {
  BUILTIN_DIRECTIVES,
  type DirectivesConfig,
} from './directivesConfig'

export type CssSnippet = {
  id: string
  label: string
  detail: string
  code: string
}

const DIRECTIVE_SNIPPET_STYLES: Record<
  string,
  { border: string; background: string }
> = {
  note: {
    border: 'oklch(0.55 0.14 250)',
    background: 'oklch(0.97 0.02 250)',
  },
  tip: {
    border: 'oklch(0.55 0.14 150)',
    background: 'oklch(0.97 0.02 150)',
  },
  warning: {
    border: 'oklch(0.7 0.16 75)',
    background: 'oklch(0.98 0.03 85)',
  },
  important: {
    border: 'oklch(0.55 0.18 25)',
    background: 'oklch(0.97 0.03 25)',
  },
  aside: {
    border: 'oklch(0.5 0.02 260)',
    background: 'oklch(0.975 0.006 260)',
  },
}

const DEFAULT_DIRECTIVE_STYLE = {
  border: 'oklch(0.55 0.1 260)',
  background: 'oklch(0.97 0.015 260)',
}

/** CSS block for styling a single directive (`.md-directive--{name}`). */
export function formatDirectiveAsCustomCss(name: string): string {
  const style = DIRECTIVE_SNIPPET_STYLES[name] ?? DEFAULT_DIRECTIVE_STYLE
  return `.md-directive--${name} {
  border-left-color: ${style.border};
  background: ${style.background};
}
`
}

/** Built-in + user directive chips for the style.css insert toolbar. */
export function listDirectiveCssSnippets(
  config: DirectivesConfig,
): CssSnippet[] {
  return [...BUILTIN_DIRECTIVES, ...config.directives].map((directive) => ({
    id: `directive-${directive.name}`,
    label: directive.name,
    detail: `${directive.label} · .md-directive--${directive.name}`,
    code: formatDirectiveAsCustomCss(directive.name),
  }))
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
  {
    label: 'md-directive',
    detail: 'callout / aside 베이스',
    insertText: `.md-directive--block {
  padding: 0.85em 1em;
  border-left-width: 3px;
  border-radius: 6px;
}

.md-directive__label {
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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
