import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children?: React.ReactNode
  title?: string
  lit?: boolean
}

export default function ResCardBorder({ children, title, lit }: Props) {
  return (
    <div
      className={cx(
        'absolute inset-0 z-20 flex flex-col items-center rounded',
        lit == null && 'border border-gray-300/10',
        lit != null &&
          (lit
            ? 'border-8 border-phosphorus-500/80'
            : 'border-8 border-rose-500/80')
      )}
    >
      {title && (
        <div
          className={cx(
            'rounded-b  px-2 pb-0.5',
            'text-center text-xs font-semibold',
            lit == null && 'bg-gray-300/10 text-white',
            lit != null &&
              (lit
                ? 'bg-phosphorus-500/80 text-black'
                : 'bg-rose-500/80 text-black')
          )}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
