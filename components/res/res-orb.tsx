import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  className?: string
  disabled?: boolean
}

export default function ResOrb({ className, disabled }: Props) {
  return (
    <div
      className={cx(
        'h-4 w-4 rounded-full',
        disabled
          ? 'bg-gray-600/75 shadow shadow-gray-300/30'
          : 'animate-pulse-infinite bg-phosphorus-500 shadow-md shadow-phosphorus-500',
        className
      )}
    ></div>
  )
}
