export const DIRECTIVES_STORAGE_KEY = 'markdownist:directives:v1'

export type DirectiveDefinition = {
  name: string
  label: string
}

export type DirectivesConfig = {
  version: 1
  directives: DirectiveDefinition[]
}

export const BUILTIN_DIRECTIVES: DirectiveDefinition[] = [
  { name: 'note', label: 'Note' },
  { name: 'tip', label: 'Tip' },
  { name: 'warning', label: 'Warning' },
  { name: 'important', label: 'Important' },
]

export const DEFAULT_DIRECTIVES_JSON = `{
  "version": 1,
  "directives": [
    {
      "name": "aside",
      "label": "Aside"
    }
  ]
}
`

const NAME_PATTERN = /^[a-z][a-z0-9-]*$/

export function isValidDirectiveName(name: string): boolean {
  return NAME_PATTERN.test(name)
}

export function parseDirectivesConfig(raw: string): {
  config: DirectivesConfig
  error: string | null
} {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        config: { version: 1, directives: [] },
        error: '루트는 객체여야 합니다.',
      }
    }

    const record = parsed as Record<string, unknown>
    if (record.version !== 1) {
      return {
        config: { version: 1, directives: [] },
        error: 'version은 1이어야 합니다.',
      }
    }

    if (!Array.isArray(record.directives)) {
      return {
        config: { version: 1, directives: [] },
        error: 'directives는 배열이어야 합니다.',
      }
    }

    const directives: DirectiveDefinition[] = []
    const seen = new Set<string>()

    for (const [index, entry] of record.directives.entries()) {
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
        return {
          config: { version: 1, directives: [] },
          error: `directives[${index}]는 객체여야 합니다.`,
        }
      }

      const item = entry as Record<string, unknown>
      if (typeof item.name !== 'string' || typeof item.label !== 'string') {
        return {
          config: { version: 1, directives: [] },
          error: `directives[${index}]에 name·label 문자열이 필요합니다.`,
        }
      }

      const name = item.name.trim()
      const label = item.label.trim()
      if (!isValidDirectiveName(name)) {
        return {
          config: { version: 1, directives: [] },
          error: `directives[${index}].name은 소문자/숫자/하이픈만 가능합니다.`,
        }
      }

      if (label.length === 0) {
        return {
          config: { version: 1, directives: [] },
          error: `directives[${index}].label이 비어 있습니다.`,
        }
      }

      if (seen.has(name) || BUILTIN_DIRECTIVES.some((d) => d.name === name)) {
        return {
          config: { version: 1, directives: [] },
          error: `directives[${index}].name "${name}"이 중복되었거나 빌트인과 겹칩니다.`,
        }
      }

      seen.add(name)
      directives.push({ name, label })
    }

    return {
      config: { version: 1, directives },
      error: null,
    }
  } catch {
    return {
      config: { version: 1, directives: [] },
      error: 'JSON 파싱에 실패했습니다.',
    }
  }
}

export function resolveDirectiveLabel(
  name: string,
  config: DirectivesConfig,
  explicitLabel?: string,
): string | undefined {
  if (explicitLabel && explicitLabel.trim().length > 0) {
    return explicitLabel.trim()
  }

  const builtin = BUILTIN_DIRECTIVES.find((item) => item.name === name)
  if (builtin) {
    return builtin.label
  }

  return config.directives.find((item) => item.name === name)?.label
}

export function loadDirectivesJson(
  storage: Storage | null = getLocalStorage(),
): string {
  if (!storage) {
    return DEFAULT_DIRECTIVES_JSON
  }

  try {
    const raw = storage.getItem(DIRECTIVES_STORAGE_KEY)
    if (raw === null) {
      return DEFAULT_DIRECTIVES_JSON
    }
    return raw
  } catch {
    return DEFAULT_DIRECTIVES_JSON
  }
}

export function saveDirectivesJson(
  json: string,
  storage: Storage | null = getLocalStorage(),
): boolean {
  if (!storage) {
    return false
  }

  try {
    storage.setItem(DIRECTIVES_STORAGE_KEY, json)
    return true
  } catch {
    return false
  }
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
