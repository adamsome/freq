import type { ReactNode } from 'react'
import { BlowCardSize } from '../../lib/types/blow.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import BlowCard from './blow-card'

type Props = {
  children: ReactNode
  size: BlowCardSize
  cards?: number
}

export default function BlowCardTitle({
  children,
  size = 'sm',
  cards = 0,
}: Props) {
  const sm = size === 'xs' || size === 'sm'

  return (
    <div
      className={cx(
        'flex-center space-x-1',
        'font-semibold w-full overflow-hidden whitespace-nowrap',
        sm && 'text-[3.5px] leading-normal tracking-widest'
      )}
    >
      <span className="flex-1 text-left">{children}</span>

      {range(0, cards).map((i) => (
        <BlowCard key={i} size="xs" color="cyan" />
      ))}
    </div>
  )
}
