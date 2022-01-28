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

  const height = isCommonRole ? 'h-13' : 'h-20'

  const asButton = view.clickableID != null && onActionClick
  const Component = asButton ? 'button' : 'div'

  return (
    <Component
      type={asButton ? 'button' : undefined}
      className={cx(className, view.classes.button, [
        'flex flex-col',
        'w-full',
        height,
        'px-0.5 pt-0.5 pb-1.5',
        'font-narrow',
        'text-black dark:text-white',
        'border',
        'rounded-md',
        'focus:outline-none focus:dark:outline-none',
        'group',
        'shadow',
        'select-none',
      ])}
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
