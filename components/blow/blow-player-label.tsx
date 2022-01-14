import { BlowPlayerView } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'

type Props = {
  children?: BlowPlayerView | string
  value?: BlowPlayerView | string
  className?: string
}

export default function BlowPlayerLabel({ children, value, className }: Props) {
  const player = children ?? value
  const label = typeof player === 'string' ? player : player?.name
  return (
    <span className={cx('font-spaced-narrow font-semibold', className)}>
      {label}
    </span>
  )
}
