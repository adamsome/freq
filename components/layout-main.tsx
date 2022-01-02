import type { ReactNode } from 'react'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  children: ReactNode
}

const defaultProps = {
  classNames: '',
}

export default function LayoutMain({ children, classNames }: Props) {
  return (
    <main
      className={cx(
        'flex-1 flex flex-col items-center',
        'w-full max-w-screen-md pb-4 md:px-2 md:py-5',
        classNames
      )}
    >
      {children}
    </main>
  )
}

LayoutMain.defaultProps = defaultProps
