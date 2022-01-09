import type { ReactNode } from 'react'
import React from 'react'
import { BlowCardSize } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'

type Props = {
  children?: ReactNode
  className?: string
  size?: BlowCardSize
  orientation?: 'horizontal' | 'vertical'
}

export default function BlowCardShape({
  children,
  className = '',
  size = 'sm',
  orientation = 'vertical',
}: Props) {
  return (
    <div
      className={cx(
        size === 'xs'
          ? '[--blow-card-unit:0.1875rem]'
          : size === 'sm'
          ? '[--blow-card-unit:0.28125rem]'
          : '[--blow-card-unit:1.4375rem]',
        orientation === 'vertical'
          ? [
              'w-[calc(var(--blow-card-unit)*5)]',
              'h-[calc(var(--blow-card-unit)*7)]',
            ]
          : [
              'w-[calc(var(--blow-card-unit)*7)]',
              'xs:h-[calc(var(--blow-card-unit)*5)]',
            ],
        className
      )}
    >
      {children}
    </div>
  )
}
