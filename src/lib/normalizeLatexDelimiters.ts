const CODE_MASK_START = '\uE200'
const CODE_MASK_END = '\uE201'

/**
 * Convert LaTeX delimiters `\[...\]` / `\(...\)` to `$` / `$$` so remark-math
 * can parse them. CommonMark would otherwise treat `\[` as an escaped `[`.
 * Leaves fenced/inline code untouched.
 */
export function normalizeLatexDelimiters(source: string): string {
  const slots: string[] = []

  const masked = source.replace(
    /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g,
    (match) => {
      const index = slots.length
      slots.push(match)
      return `${CODE_MASK_START}${index}${CODE_MASK_END}`
    },
  )

  const withDisplay = masked.replace(/\\\[([\s\S]*?)\\\]/g, (_match, body: string) => {
    const trimmed = body.replace(/^\n/, '').replace(/\n$/, '')
    return `$$\n${trimmed}\n$$`
  })

  const withInline = withDisplay.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_match, body: string) => `$${body}$`,
  )

  return withInline.replace(
    new RegExp(`${CODE_MASK_START}(\\d+)${CODE_MASK_END}`, 'g'),
    (_match, index: string) => slots[Number(index)] ?? '',
  )
}
