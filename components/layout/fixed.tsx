import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function Fixed({ children, className }: Props) {
  return (
    <div className={cx('fixed left-0 right-0 z-40 px-2', className)}>
      {children}
    </div>
  )
}
