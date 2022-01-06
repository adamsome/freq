import type { ReactNode } from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: ReactNode
}

export default function BlowRoleCardOutline({ children }: Props) {
  return (
    <div
      className={cx(
        'p-1.5',
        'w-[calc(var(--blow-card-unit)*7)]',
        'h-[calc(var(--blow-card-unit)*5)]',
        'font-spaced-narrow text-black dark:text-white',
        'bg-white dark:bg-black',
        'border border-gray-300 dark:border-cyan-950 rounded-md'
      )}
    >
      {children}
    </div>
  )
}
