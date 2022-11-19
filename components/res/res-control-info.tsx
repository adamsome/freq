import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = {
  children: React.ReactNode
  heading?: string
  lead?: string
  positive?: boolean
  negative?: boolean
}

export default function ResControlInfo({
  children,
  heading,
  lead,
  positive,
  negative,
}: Props) {
  let color = 'text-purple-400'
  if (positive) color = 'text-phosphorus-500'
  if (negative) color = 'text-rose-500'
  return (
    <div className="space-y-1">
      {heading && (
        <h1
          className={cx(
            'text-center font-sans text-xl font-semibold tracking-[0.125em]',
            color
          )}
        >
          {heading}
        </h1>
      )}
      <p>
        {lead && <span className={cx('font-semibold', color)}>{lead} </span>}
        {children}
      </p>
    </div>
  )
}
