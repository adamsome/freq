import type { ReactNode } from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: ReactNode
  className?: string
}

export default function Heading({ children, className }: Props) {
  return (
    <h1
      className={cx(`
        mb-6 flex w-full items-center
        text-3xl font-semibold
        md:mb-8 md:pl-0
        ${className}
      `)}
    >
      {children}
    </h1>
  )
}
