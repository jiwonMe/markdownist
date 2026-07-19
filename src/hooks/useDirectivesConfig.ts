import { useEffect, useMemo, useState } from 'react'
import {
  type DirectivesConfig,
  loadDirectivesJson,
  parseDirectivesConfig,
  saveDirectivesJson,
} from '../lib/directivesConfig'

const SAVE_DELAY_MS = 300

export type UseDirectivesConfigResult = {
  directivesJson: string
  setDirectivesJson: (json: string) => void
  config: DirectivesConfig
  parseError: string | null
}

export function useDirectivesConfig(): UseDirectivesConfigResult {
  const [directivesJson, setDirectivesJson] = useState(() =>
    loadDirectivesJson(),
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDirectivesJson(directivesJson)
    }, SAVE_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [directivesJson])

  const { config, error: parseError } = useMemo(
    () => parseDirectivesConfig(directivesJson),
    [directivesJson],
  )

  return {
    directivesJson,
    setDirectivesJson,
    config,
    parseError,
  }
}
