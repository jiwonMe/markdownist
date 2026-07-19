import type { Monaco } from '@monaco-editor/react'
import {
  CSS_EDITOR_SNIPPETS,
  CSS_VARIABLE_SUGGESTIONS,
} from '../lib/cssSnippets'

let registered = false

export function registerCssAssist(monaco: Monaco): void {
  if (registered) {
    return
  }
  registered = true

  monaco.languages.registerCompletionItemProvider('css', {
    triggerCharacters: ['-', ':', '.'],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const snippetItems = CSS_EDITOR_SNIPPETS.map((snippet) => ({
        label: snippet.label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: snippet.detail,
        insertText: snippet.insertText,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        sortText: `0_${snippet.label}`,
      }))

      const variableItems = CSS_VARIABLE_SUGGESTIONS.map((name) => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Variable,
        detail: 'Markdownist token',
        insertText: name,
        range,
        sortText: `1_${name}`,
      }))

      const selectorItems = [
        'h1',
        'h2',
        'h3',
        'p',
        'a',
        'code',
        'pre',
        'blockquote',
        'table',
        'th',
        'td',
        'ul',
        'ol',
        'li',
        'img',
        'hr',
        'strong',
        ':scope',
      ].map((selector) => ({
        label: selector,
        kind: monaco.languages.CompletionItemKind.Keyword,
        detail: '문서 선택자',
        insertText:
          selector === ':scope'
            ? ':scope {\n  $0\n}'
            : `${selector} {\n  $0\n}`,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        sortText: `2_${selector}`,
      }))

      return {
        suggestions: [...snippetItems, ...variableItems, ...selectorItems],
      }
    },
  })
}
