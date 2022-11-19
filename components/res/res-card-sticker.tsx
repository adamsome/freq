import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: React.ReactNode
  className?: string
  rotateIndex?: number
  positive?: boolean
  negative?: boolean
  disabled?: boolean
}

function getRotateClass(rotateIndex?: number): string | undefined {
  if (rotateIndex == null) return
  switch (rotateIndex % 5) {
    case 0:
      return 'rotate-6'
    case 1:
      return '-rotate-3'
    case 2:
      return 'rotate-2'
    case 3:
      return '-rotate-12'
    case 4:
      return 'rotate-12'
  }
}

export default function ResCardSticker({
  children,
  className,
  rotateIndex,
  positive,
  negative,
  disabled,
}: Props) {
  const textLength = children?.toString()?.length ?? 0
  return (
    <div
      className={cx(
        'flex-center h-20 w-20 flex-wrap transition-all',
        'text-center font-sans font-extrabold tracking-[0.125em]',
        'animate-fade-in overflow-hidden rounded-full border',
        'border-gray-300/10 shadow-xl backdrop-blur-sm',
        !positive &&
          !negative &&
          'bg-purple-900/50 text-phosphorus-500 shadow-purple-900/40',
        positive && 'bg-phosphorus-500/75 text-black shadow-phosphorus-700/60',
        negative && 'bg-rose-500/75 text-black shadow-rose-700/60',
        textLength != null && textLength > 3 ? 'text-sm' : 'text-xl',
        getRotateClass(rotateIndex),
        disabled && 'opacity-70',
        className
      )}
    >
      <div
        className={cx(
          'flex-center h-12 w-full border-y-2 border-gray-300/10',
          'px-2 shadow-sm',
          !positive && !negative && 'bg-black/30 shadow-purple-900/20',
          (positive || negative) && 'bg-black/90 shadow-black/10',
          positive && 'text-phosphorus-500',
          negative && 'text-rose-500'
        )}
      >
        {children}
      </div>
    </div>
  )
}
