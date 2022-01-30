import type { ReactNode } from 'react'
import React from 'react'
import getBlowRoleView from './blow-role-card-view'
import { cx } from '../../lib/util/dom'
import { BlowRoleCardProps } from './blow-role-card'

type Props = BlowRoleCardProps & {
  children?: ReactNode
  className?: string
}

export default function BlowRoleCardButton(props: Props) {
  const {
    children,
    className,
    id,
    index,
    actions = {},
    theme,
    phase,
    onActionClick,
  } = props

  const isCommonRole = id === 'common'

  const view = getBlowRoleView(theme, id, actions, {
    clickable: phase === 'prep',
    useActionIndex: isCommonRole ? index : undefined,
  })

  const asButton = view.clickableID != null && onActionClick
  const Component = asButton ? 'button' : 'div'

  return (
    <Component
      type={asButton ? 'button' : undefined}
      className={cx(
        className,
        id != null && view.classes.button,
        !id ? 'border-transparent' : 'px-0.5 pt-0 pb-0.5 xs:pt-0.5',
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
