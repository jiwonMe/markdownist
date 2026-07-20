import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { loadUpmathLatex } from './lib/upmathLatex'

async function bootstrap(): Promise<void> {
  try {
    await loadUpmathLatex()
  } catch {
    // Preview still works; formulas stay as $...$ / $$...$$ until the script loads.
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
