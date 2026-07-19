import { useEffect, useState } from 'react'
import { loadDraft, saveDraft } from '../lib/draftStorage'

const SAVE_DELAY_MS = 300

export type UseDraftResult = {
  filename: string
  markdown: string
  setFilename: (filename: string) => void
  setMarkdown: (markdown: string) => void
}

export function useDraft(): UseDraftResult {
  const [filename, setFilename] = useState(() => loadDraft().filename)
  const [markdown, setMarkdown] = useState(() => loadDraft().markdown)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDraft({ filename, markdown })
    }, SAVE_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [filename, markdown])

  return {
    filename,
    markdown,
    setFilename,
    setMarkdown,
  }
}
