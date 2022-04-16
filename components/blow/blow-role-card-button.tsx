import type { ReactNode } from 'react'
import React from 'react'
import { cx } from '../../lib/util/dom'
import { BlowRoleCardProps } from './blow-role-card'
import { BlowRoleView } from './blow-role-card-view'

type Props = BlowRoleCardProps & {
  children?: ReactNode
  view: BlowRoleView
}

export default function BlowRoleCardButton(props: Props) {
  const { children, className, view, id, variant, onActionClick } = props

  const asButton = view.clickableID != null && onActionClick
  const Component = asButton ? 'button' : 'div'

  return (
    <Component
      type={asButton ? 'button' : undefined}
      className={cx(
        className,
        id != null && variant !== 'empty' && view.classes.button,
        !id ? 'border-transparent' : 'px-0.5 pt-0 pb-0.5 xs:pt-0.5',
        variant === 'empty' && {
          'h-12 border-2 border-dashed border-black/10 dark:border-white/10':
            true,
        },
        `group
        w-full
        select-none
        rounded-md
        border
        font-narrow
        text-black
        shadow
        focus:outline-none
        dark:text-white
        focus:dark:outline-none`
      )}
      onClick={(e) => {
        e.preventDefault()
        if (view.clickableID == null) return
        onActionClick?.(view.clickableID)
      }}
    >
      {children}
    </Component>
  )
}
