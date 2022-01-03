import type { ReactNode } from 'react'
import { cx } from '../lib/util/dom'

type Props = typeof defaultProps & {
  children: ReactNode
}

const defaultProps = {
  classNames: '',
}

export default function Heading({ children, classNames }: Props) {
  return (
    <h1
      className={cx(
        'flex items-center w-full',
        'text-3xl font-semibold mb-6 md:mb-8 pl-4 md:pl-0',
        classNames
      )}
    >
      {children}
    </h1>
  )
}

Heading.defaultProps = defaultProps
