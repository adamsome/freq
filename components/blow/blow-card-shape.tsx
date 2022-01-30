import type { ReactNode } from 'react'
import React from 'react'
import { cx } from '../../lib/util/dom'
import { BlowCardProps } from './blow-card'

type Props = BlowCardProps & {
  children?: ReactNode
  className?: string
}

export default function BlowCardShape({
  children,
  className = '',
  size = 'sm',
  orientation = 'vertical',
  theme,
}: Props) {
  const horizontal = orientation === 'horizontal'
  const magicRole = theme !== 'classic' && horizontal
  return (
    <div
      className={cx(className, {
        relative: true,
        'flex-center': true,
        '[--blow-card-unit:0.1875rem]': size === 'xs',
        '[--blow-card-unit:0.28125rem]': size === 'sm',
        '[--blow-card-unit:1.4374rem]': size === 'md',
        // Width of 'lg' vertical card same as width of 'lg' horizontal card
        '[--blow-card-unit:1.4375rem]': size === 'lg' && horizontal,
        '[--blow-card-unit:1.7rem]': size === 'lg' && !horizontal,
        'w-[calc(var(--blow-card-unit)*5)]': !horizontal,
        'h-[calc(var(--blow-card-unit)*7)]': !horizontal,
        'w-[calc(var(--blow-card-unit)*7)]': horizontal && !magicRole,
        'xs:h-[calc(var(--blow-card-unit)*5)]': horizontal && !magicRole,
        'w-full': magicRole,
      })}
    >
      {children}
    </div>
  )
}
