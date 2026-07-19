import type { Html, Paragraph, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const PAGE_BREAK_PATTERN = /^<!--\s*pagebreak\s*-->$/i

function createPageBreakNode(): Paragraph {
  return {
    type: 'paragraph',
    data: {
      hName: 'div',
      hProperties: {
        className: ['page-break'],
      },
    },
    children: [],
  }
}

export const remarkPageBreak: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (index === undefined || !parent) {
        return
      }

      if (node.type === 'thematicBreak') {
        parent.children[index] = createPageBreakNode()
        return
      }

      if (node.type !== 'html') {
        return
      }

      const htmlNode = node as Html
      if (!PAGE_BREAK_PATTERN.test(htmlNode.value.trim())) {
        return
      }

      parent.children[index] = createPageBreakNode()
    })
  }
}
