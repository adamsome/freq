import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function Tag({ children, className }: Props) {
  return (
    <div
      className={cx(
        'rounded text-black',
        'px-1 pt-px',
        'text-[10px] font-semibold leading-[12px]',
        'shadow shadow-black',
        className
      )}
    >
      {children}
    </div>
  )
}
