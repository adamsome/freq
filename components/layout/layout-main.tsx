import type { ReactNode } from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: ReactNode
  className?: string
  paddingClass?: string
}

export default function LayoutMain({
  children,
  className = '',
  paddingClass = 'pb-4 md:px-2 md:py-5',
}: Props) {
  return (
    <main
      className={cx(
        `flex w-full max-w-screen-md flex-1 flex-col items-center`,
        paddingClass,
        className
      )}
    >
      {children}
    </main>
  )
}
