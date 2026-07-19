import {
  PRINT_THEME_OPTIONS,
  type PrintThemeId,
} from './printTheme'

type ThemeCssExport = {
  tokens: Record<string, string>
  extra?: string
}

const HEADING_TIGHT = `h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 1.1em 0 0.4em;
}
`

const HEADING_DENSE = `h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 1em 0 0.35em;
}
`

const PRINT_THEME_CSS: Record<PrintThemeId, ThemeCssExport> = {
  classic: {
    tokens: {
      '--md-font-body': 'var(--font-body)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '700',
      '--md-letter-spacing-heading': '-0.02em',
      '--md-line-height': '1.7',
      '--md-block-gap': '1em',
      '--md-max-width': '720px',
      '--md-h1-size': '2em',
      '--md-h2-size': '1.5em',
      '--md-h3-size': '1.25em',
      '--md-link': 'oklch(0.48 0.18 260)',
      '--md-link-hover': 'oklch(0.4 0.2 260)',
      '--md-code-bg': 'oklch(0.96 0.004 260)',
      '--md-code-border': '1px solid oklch(0 0 0 / 0.08)',
      '--md-pre-bg': 'oklch(0.97 0.004 260)',
      '--md-pre-border': '1px solid oklch(0 0 0 / 0.1)',
      '--md-quote-border': '2px solid oklch(0 0 0 / 0.12)',
      '--md-table-border': '1px solid oklch(0 0 0 / 0.1)',
      '--md-table-header-bg': 'oklch(0.97 0.004 260)',
      '--md-heading-rule': 'transparent',
    },
  },
  clean: {
    tokens: {
      '--md-font-body': 'var(--font-sans)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '600',
      '--md-letter-spacing-heading': '-0.03em',
      '--md-line-height': '1.75',
      '--md-block-gap': '1.15em',
      '--md-max-width': '680px',
      '--md-link': 'var(--fg, oklch(0.22 0.012 260))',
      '--md-link-hover': 'oklch(0.35 0.02 260)',
      '--md-code-bg': 'oklch(0.975 0.003 260)',
      '--md-code-border': '1px solid oklch(0 0 0 / 0.06)',
      '--md-pre-bg': 'oklch(0.98 0.003 260)',
      '--md-pre-border': '1px solid oklch(0 0 0 / 0.08)',
      '--md-quote-border': '1px solid oklch(0 0 0 / 0.1)',
      '--md-quote-fg': 'var(--fg-muted, oklch(0.62 0.012 260))',
      '--md-table-border': '1px solid oklch(0 0 0 / 0.06)',
      '--md-table-header-bg': 'transparent',
      '--md-hr': 'oklch(0 0 0 / 0.08)',
      '--md-pagebreak-border': '1px dashed oklch(0 0 0 / 0.16)',
      '--md-pagebreak-margin': '2.25rem 0',
    },
    extra: `th {
  border-bottom: 1px solid oklch(0 0 0 / 0.14);
  font-weight: 600;
}
`,
  },
  compact: {
    tokens: {
      '--md-font-body': 'var(--font-sans)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '600',
      '--md-letter-spacing-heading': '-0.025em',
      '--md-line-height': '1.5',
      '--md-block-gap': '0.75em',
      '--md-max-width': '760px',
      '--md-h1-size': '1.75em',
      '--md-h2-size': '1.35em',
      '--md-h3-size': '1.15em',
      '--md-code-size': '0.84em',
      '--md-code-radius': '4px',
      '--md-pre-radius': '8px',
      '--md-quote-border': '1px solid oklch(0 0 0 / 0.14)',
      '--md-table-cell-pad': '4px 8px',
      '--md-pagebreak-margin': '1.5rem 0',
      '--md-pagebreak-border': '1px dashed oklch(0 0 0 / 0.2)',
    },
    extra: HEADING_TIGHT,
  },
  report: {
    tokens: {
      '--md-font-body': 'var(--font-sans)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '700',
      '--md-letter-spacing-heading': '-0.02em',
      '--md-line-height': '1.65',
      '--md-block-gap': '1em',
      '--md-max-width': '720px',
      '--md-link': 'var(--fg, oklch(0.22 0.012 260))',
      '--md-link-hover': 'oklch(0.35 0.02 260)',
      '--md-code-bg': 'oklch(0.94 0.006 260)',
      '--md-code-border': '1px solid oklch(0 0 0 / 0.12)',
      '--md-pre-bg': 'oklch(0.955 0.005 260)',
      '--md-pre-border': '1px solid oklch(0 0 0 / 0.14)',
      '--md-quote-border': '3px solid oklch(0 0 0 / 0.18)',
      '--md-quote-bg': 'oklch(0.975 0.004 260)',
      '--md-quote-fg': 'var(--fg-secondary, oklch(0.5 0.014 260))',
      '--md-table-border': '1px solid oklch(0 0 0 / 0.14)',
      '--md-table-header-bg': 'oklch(0.94 0.008 260)',
      '--md-table-cell-pad': '8px 12px',
      '--md-hr': 'oklch(0 0 0 / 0.14)',
      '--md-heading-rule': 'oklch(0 0 0 / 0.14)',
      '--md-heading-rule-pad': '0.35em',
      '--md-pagebreak-fg': 'var(--fg-secondary, oklch(0.5 0.014 260))',
    },
  },
  academic: {
    tokens: {
      '--md-font-body': 'var(--font-body)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '600',
      '--md-letter-spacing-heading': '-0.015em',
      '--md-line-height': '1.8',
      '--md-block-gap': '1.1em',
      '--md-max-width': '700px',
      '--md-h1-size': '1.85em',
      '--md-h2-size': '1.4em',
      '--md-link': 'oklch(0.42 0.12 250)',
      '--md-link-hover': 'oklch(0.35 0.14 250)',
      '--md-code-bg': 'oklch(0.97 0.004 260)',
      '--md-code-border': '1px solid oklch(0 0 0 / 0.06)',
      '--md-pre-bg': 'oklch(0.975 0.003 260)',
      '--md-pre-border': '1px solid oklch(0 0 0 / 0.08)',
      '--md-quote-border': '2px solid oklch(0 0 0 / 0.1)',
      '--md-quote-fg': 'var(--fg-muted, oklch(0.62 0.012 260))',
      '--md-table-border': '1px solid oklch(0 0 0 / 0.08)',
      '--md-table-header-bg': 'oklch(0.98 0.003 260)',
      '--md-table-cell-pad': '6px 10px',
      '--md-hr': 'oklch(0 0 0 / 0.08)',
      '--md-pagebreak-border': '1px dashed oklch(0 0 0 / 0.18)',
      '--md-pagebreak-margin': '2.5rem 0',
    },
  },
  memo: {
    tokens: {
      '--md-font-body': 'var(--font-sans)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '600',
      '--md-letter-spacing-heading': '-0.02em',
      '--md-line-height': '1.55',
      '--md-block-gap': '0.65em',
      '--md-max-width': '560px',
      '--md-h1-size': '1.5em',
      '--md-h2-size': '1.25em',
      '--md-h3-size': '1.1em',
      '--md-code-size': '0.85em',
      '--md-code-radius': '4px',
      '--md-pre-radius': '6px',
      '--md-pre-bg': 'oklch(0.97 0.004 260)',
      '--md-quote-border': '2px solid oklch(0 0 0 / 0.16)',
      '--md-quote-fg': 'var(--fg-secondary, oklch(0.5 0.014 260))',
      '--md-table-cell-pad': '4px 8px',
      '--md-pagebreak-margin': '1.25rem 0',
    },
    extra: HEADING_DENSE,
  },
  resume: {
    tokens: {
      '--md-font-body': 'var(--font-sans)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '700',
      '--md-letter-spacing-heading': '-0.025em',
      '--md-line-height': '1.5',
      '--md-block-gap': '0.7em',
      '--md-max-width': '700px',
      '--md-h1-size': '1.65em',
      '--md-h2-size': '1.2em',
      '--md-h3-size': '1.05em',
      '--md-link': 'var(--fg, oklch(0.22 0.012 260))',
      '--md-link-hover': 'oklch(0.35 0.02 260)',
      '--md-code-bg': 'oklch(0.95 0.005 260)',
      '--md-code-border': '1px solid oklch(0 0 0 / 0.1)',
      '--md-pre-bg': 'oklch(0.96 0.004 260)',
      '--md-pre-border': '1px solid oklch(0 0 0 / 0.12)',
      '--md-quote-border': '2px solid oklch(0 0 0 / 0.14)',
      '--md-table-border': '1px solid oklch(0 0 0 / 0.12)',
      '--md-table-header-bg': 'oklch(0.93 0.008 260)',
      '--md-table-cell-pad': '5px 10px',
      '--md-hr': 'oklch(0 0 0 / 0.16)',
      '--md-heading-rule': 'oklch(0 0 0 / 0.18)',
      '--md-heading-rule-pad': '0.25em',
      '--md-pagebreak-margin': '1.5rem 0',
    },
    extra: HEADING_DENSE,
  },
  blog: {
    tokens: {
      '--md-font-body': 'var(--font-sans)',
      '--md-font-heading': 'var(--font-sans)',
      '--md-font-heading-weight': '700',
      '--md-letter-spacing-heading': '-0.03em',
      '--md-line-height': '1.8',
      '--md-block-gap': '1.25em',
      '--md-max-width': '640px',
      '--md-h1-size': '2.1em',
      '--md-h2-size': '1.55em',
      '--md-h3-size': '1.3em',
      '--md-link': 'oklch(0.48 0.18 260)',
      '--md-link-hover': 'oklch(0.4 0.2 260)',
      '--md-code-bg': 'oklch(0.96 0.006 260)',
      '--md-code-radius': '6px',
      '--md-pre-bg': 'oklch(0.97 0.005 260)',
      '--md-pre-radius': '12px',
      '--md-quote-border': '3px solid oklch(0.55 0.1 260 / 0.35)',
      '--md-quote-bg': 'oklch(0.98 0.01 260)',
      '--md-quote-fg': 'var(--fg-secondary, oklch(0.5 0.014 260))',
      '--md-table-border': '1px solid oklch(0 0 0 / 0.08)',
      '--md-table-header-bg': 'oklch(0.975 0.004 260)',
      '--md-hr': 'oklch(0 0 0 / 0.1)',
      '--md-pagebreak-margin': '2.5rem 0',
      '--md-pagebreak-border': '1px dashed oklch(0 0 0 / 0.18)',
    },
  },
}

function themeLabel(themeId: PrintThemeId): string {
  return (
    PRINT_THEME_OPTIONS.find((option) => option.id === themeId)?.label ??
    themeId
  )
}

/** Build a :scope token block (+ optional rules) for appending to style.css. */
export function formatPrintThemeAsCustomCss(themeId: PrintThemeId): string {
  const theme = PRINT_THEME_CSS[themeId]
  const tokenLines = Object.entries(theme.tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  let css = `/* Loaded theme: ${themeLabel(themeId)} */\n:scope {\n${tokenLines}\n}\n`

  if (theme.extra) {
    css += `\n${theme.extra.trimEnd()}\n`
  }

  return css
}
