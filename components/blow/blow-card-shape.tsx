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
}: Props) {
  const horizontal = orientation === 'horizontal'
  return (
    <div
      className={cx(className, {
        relative: true,
        'flex-center': true,
        '[--blow-card-unit:0.1875rem]': size === 'xs',
        '[--blow-card-unit:0.28125rem]': size === 'sm',
        // Width of 'md' vertical card same as width of 'md' horizontal card
        '[--blow-card-unit:1.4375rem]': size === 'md' && horizontal,
        '[--blow-card-unit:2rem]': size === 'md' && !horizontal,
        'w-[calc(var(--blow-card-unit)*5)]': !horizontal,
        'h-[calc(var(--blow-card-unit)*7)]': !horizontal,
        'w-[calc(var(--blow-card-unit)*7)]': horizontal,
        'xs:h-[calc(var(--blow-card-unit)*5)]': horizontal,
      })}
    >
      {children}
    </div>
  )
}
