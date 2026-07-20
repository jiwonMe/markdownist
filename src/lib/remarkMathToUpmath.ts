import type { Paragraph, Root, Text } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

type MathLike = {
  type: 'math' | 'inlineMath'
  value: string
}

function isMathLike(node: { type: string }): node is MathLike {
  return (
    (node.type === 'math' || node.type === 'inlineMath') &&
    typeof (node as MathLike).value === 'string'
  )
}

function toUpmathText(node: MathLike): Text {
  const value =
    node.type === 'math' ? `$$\n${node.value}\n$$` : `$$${node.value}$$`
  return { type: 'text', value }
}

/**
 * Convert remark-math nodes into literal `$$...$$` text for Upmath.
 * Keeps math out of Markdown setext/emphasis parsing while staying Upmath-compatible.
 */
export const remarkMathToUpmath: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (index === undefined || !parent || !isMathLike(node)) {
        return
      }

      if (node.type === 'math') {
        const paragraph: Paragraph = {
          type: 'paragraph',
          children: [toUpmathText(node)],
        }
        parent.children[index] = paragraph
        return
      }

      parent.children[index] = toUpmathText(node)
    })
  }
}
