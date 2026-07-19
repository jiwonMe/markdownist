import type {
  BlockContent,
  DefinitionContent,
  Paragraph,
  Root,
} from 'mdast'
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective

function isDirectiveType(type: string): type is DirectiveNode['type'] {
  return (
    type === 'textDirective' ||
    type === 'leafDirective' ||
    type === 'containerDirective'
  )
}

function extractLabelText(paragraph: Paragraph): string {
  return paragraph.children
    .map((child) => ('value' in child ? String(child.value) : ''))
    .join('')
    .trim()
}

function takeContainerLabel(node: ContainerDirective): string | undefined {
  const first = node.children[0]
  if (
    first &&
    first.type === 'paragraph' &&
    first.data &&
    'directiveLabel' in first.data &&
    first.data.directiveLabel === true
  ) {
    const label = extractLabelText(first)
    node.children = node.children.slice(1) as Array<
      BlockContent | DefinitionContent
    >
    return label.length > 0 ? label : undefined
  }
  return undefined
}

function applyHastMapping(
  node: DirectiveNode,
  label: string | undefined,
): void {
  const data = node.data ?? (node.data = {})
  const isText = node.type === 'textDirective'

  data.hName = isText ? 'span' : 'aside'
  data.hProperties = {
    className: [
      'md-directive',
      `md-directive--${node.name}`,
      isText ? 'md-directive--inline' : 'md-directive--block',
    ],
    'data-directive': node.name,
    ...(label ? { 'data-label': label } : {}),
  }
}

export const remarkDirectives: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (!isDirectiveType(node.type)) {
        return
      }

      const directive = node as DirectiveNode
      const label =
        directive.type === 'containerDirective'
          ? takeContainerLabel(directive)
          : undefined

      applyHastMapping(directive, label)
    })
  }
}
