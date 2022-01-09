import type { ReactNode } from 'react'
import React from 'react'
import {
  BlowCardColor,
  BlowCardSize,
  BlowCardVariant,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowCardShape from './blow-card-shape'

type Props = {
  children?: ReactNode
  className?: string
  size?: BlowCardSize
  orientation?: 'horizontal' | 'vertical'
  variant?: BlowCardVariant
  color?: BlowCardColor
}

export default function BlowCardBorder({
  children,
  className = '',
  size = 'sm',
  orientation = 'vertical',
  variant = 'facedown',
  color = 'gray',
}: Props) {
  const sm = size === 'xs' || size === 'sm'

  return (
    <BlowCardShape
      size={size}
      orientation={orientation}
      className={cx(
        sm && variant === 'facedown' && 'p-px',
        !sm && 'p-0.5 xs:p-1.5',
        !sm && 'bg-white dark:bg-black',
        {
          'border-gray-300 dark:border-gray-700': sm && color === 'gray',
          'border-gray-300 dark:border-cyan-950': !sm && color === 'gray',
          'border-cyan-500 dark:border-cyan-500': color === 'cyan',
        },
        variant === 'empty'
          ? 'border-2 border-dashed'
          : sm && variant === 'faceup'
          ? 'border-0'
          : 'border',
        sm ? 'rounded-sm' : 'rounded-md',
        className
      )}
    >
      {children}
    </BlowCardShape>
  )
}
