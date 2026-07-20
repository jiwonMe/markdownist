export const DRAFT_STORAGE_KEY = 'markdownist:draft:v1'

export const DEFAULT_FILENAME = 'untitled.md'

export const DEFAULT_MARKDOWN = `# Markdownist

왼쪽에서 미리보기를, 오른쪽에서 Markdown을 편집하세요.

인쇄 버튼을 누르면 미리보기가 A4 PDF로 저장됩니다.

:::tip[시작 팁]
\`directives.json\`에서 커스텀 directive를 추가하고, Markdown에서 \`:::name\`으로 사용할 수 있습니다.
:::

수식은 인라인 \`$...$\` / \`\\(...\\)\`, 블록 \`$$...$$\` / \`\\[...\\]\` (Upmath): 인라인 $E=mc^2$.

$$
\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}
$$

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}\`
}
\`\`\`

---

## 페이지 나누기

단독 줄에 \`---\`를 넣으면 새 페이지가 시작됩니다.

| 기능 | 지원 |
| --- | --- |
| GFM 표 | 예 |
| 체크리스트 | 예 |
| 페이지 나누기 | 예 |
| Directive | 예 |
| 수식 (Upmath) | 예 |
| 코드 하이라이트 | 예 |

- [x] 미리보기
- [x] 편집
- [ ] 인쇄해 보기
`

export type Draft = {
  version: 1
  filename: string
  markdown: string
  updatedAt: number
}

export type DraftInput = {
  filename: string
  markdown: string
}

function isDraft(value: unknown): value is Draft {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const draft = value as Partial<Draft>
  return (
    draft.version === 1 &&
    typeof draft.filename === 'string' &&
    typeof draft.markdown === 'string' &&
    typeof draft.updatedAt === 'number'
  )
}

export function createDefaultDraft(): Draft {
  return {
    version: 1,
    filename: DEFAULT_FILENAME,
    markdown: DEFAULT_MARKDOWN,
    updatedAt: Date.now(),
  }
}

export function loadDraft(storage: Storage | null = getLocalStorage()): Draft {
  if (!storage) {
    return createDefaultDraft()
  }

  try {
    const raw = storage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) {
      return createDefaultDraft()
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isDraft(parsed)) {
      return createDefaultDraft()
    }

    return parsed
  } catch {
    return createDefaultDraft()
  }
}

export function saveDraft(
  input: DraftInput,
  storage: Storage | null = getLocalStorage(),
): boolean {
  if (!storage) {
    return false
  }

  const draft: Draft = {
    version: 1,
    filename: input.filename,
    markdown: input.markdown,
    updatedAt: Date.now(),
  }

  try {
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function toPrintTitle(filename: string): string {
  const trimmed = filename.trim()
  if (!trimmed) {
    return 'untitled'
  }

  return trimmed.replace(/\.md$/i, '') || 'untitled'
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
