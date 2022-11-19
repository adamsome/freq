import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  className?: string
  rotateIndex?: number
  positive: boolean
}

function getRotateClass(rotateIndex?: number): string | undefined {
  if (rotateIndex == null) return
  switch (rotateIndex % 5) {
    case 0:
      return 'rotate-2'
    case 1:
      return 'rotate-6'
    case 2:
      return '-rotate-12'
    case 3:
      return 'rotate-12'
    case 4:
      return '-rotate-3'
  }
}

export default function ResResultCard({
  className,
  rotateIndex,
  positive,
}: Props) {
  return (
    <div
      className={cx(
        'h-16 w-24 shadow-md shadow-black/80',
        getRotateClass(rotateIndex),
        className
      )}
    >
      <div
        className={cx(
          'flex-center h-full w-full flex-wrap transition-all',
          'text-center font-sans font-extrabold tracking-[0.125em]',
          'animate-fade-in overflow-hidden rounded border-2 p-1',
          'bg-black/75 shadow-xl backdrop-blur-sm',
          positive && 'border-phosphorus-500/90 shadow-phosphorus-700/60',
          !positive && 'border-rose-500/90 shadow-rose-700/60',
          'text-xs'
        )}
      >
        <div
          className={cx(
            'flex-center h-full w-full border border-gray-300/10',
            'px-2 shadow-sm',
            'text-black/90 shadow-black/10',
            positive && 'bg-phosphorus-500',
            !positive && 'bg-rose-500'
          )}
        >
          {positive ? 'Support' : 'Sabotage'}
        </div>
      </div>
    </div>
  )
}
