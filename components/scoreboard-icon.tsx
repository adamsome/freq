import React from 'react'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  children: React.ReactNode
}

const defaultProps = {
  className: '',
  xl: false,
  right: false,
}

export default function ScoreboardIcon({
  className,
  children,
  xl,
  right,
}: Props) {
  return (
    <div
      className={cx(
        'w-6 text-center self-center',
        right ? 'ml-0 mr-0 sm:ml-1 sm:mr-0' : 'ml-0 mr-0 sm:ml-0 sm:mr-1',
        xl ? 'text-xl' : 'text-lg sm:text-xl',
        className
      )}
    >
      {children}
    </div>
  )
}

ScoreboardIcon.defaultProps = defaultProps
