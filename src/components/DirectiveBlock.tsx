import type { ReactNode } from 'react'
import type { DirectivesConfig } from '../lib/directivesConfig'
import { resolveDirectiveLabel } from '../lib/directivesConfig'

type DirectiveBlockProps = {
  name: string
  label?: string
  inline?: boolean
  config: DirectivesConfig
  children?: ReactNode
  className?: string
}

export function DirectiveBlock({
  name,
  label,
  inline = false,
  config,
  children,
  className,
}: DirectiveBlockProps) {
  const resolvedLabel = resolveDirectiveLabel(name, config, label)
  const classes = [
    'md-directive',
    `md-directive--${name}`,
    inline ? 'md-directive--inline' : 'md-directive--block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (inline) {
    return (
      <span className={classes} data-directive={name}>
        {children}
      </span>
    )
  }

  return (
    <aside className={classes} data-directive={name}>
      {resolvedLabel ? (
        <div className="md-directive__label">{resolvedLabel}</div>
      ) : null}
      <div className="md-directive__body">{children}</div>
    </aside>
  )
}
