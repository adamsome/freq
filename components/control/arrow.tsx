import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  className?: string
  colorClass?: string
  right?: boolean
  left?: boolean
  down?: boolean
  up?: boolean
}

export default function Arrow({
  right,
  left,
  down,
  up,
  className,
  colorClass = 'bg-gray-200 dark:bg-gray-700',
}: Props) {
  const hasX = left || right
  const hasY = up || down
  return (
    <span
      className={cx(
        'relative mx-auto block',
        left || right ? 'w-full' : 'h-full',
        {
          'rotate-45': (left && up) || (right && down),
          '-rotate-45': (left && down) || (right && up),
        },
        className
      )}
    >
      <span
        className={cx(
          'absolute h-1 w-px',
          {
            'left-0.5': left && !hasY,
            'right-0.5': (hasY && !hasX) || (right && !hasY),
            'left-px': left && hasY,
            'right-px': right && hasY,
            'top-px': up && !hasX,
            'bottom-px': down && !hasX,
          },
          left || (down && !hasX) ? '-rotate-45' : 'rotate-45',
          colorClass
        )}
      ></span>
      <span
        className={cx(
          'absolute h-1 w-px',
          {
            'left-0.5': left && !hasY,
            'right-0.5': right && !hasY,
            '-right-0.5': hasY && !hasX,
            'left-px': left && hasY,
            'right-px': right && hasY,
            'top-px': up && !hasX,
            '-top-[3px]': left && !hasY,
            'bottom-px': down && !hasX,
            'bottom-0': (hasX && hasY) || (right && !hasY),
          },
          left || (down && !hasX) ? 'rotate-45' : '-rotate-45',
          colorClass
        )}
      ></span>
      <span
        className={cx(
          'relative block',
          hasY && !hasX ? 'h-full w-px' : 'h-px w-full',
          colorClass
        )}
      ></span>
    </span>
  )
}
