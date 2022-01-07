import type { ReactNode } from 'react'
import { BlowCardSize } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowCard from './blow-card'

type Props = {
  children: ReactNode
  size: BlowCardSize
  showCard?: boolean
}

export default function BlowCardTitle({
  children,
  size = 'sm',
  showCard,
}: Props) {
  const sm = size === 'xs' || size === 'sm'

  return (
    <div
      className={cx(
        'flex-center',
        'font-semibold w-full overflow-hidden whitespace-nowrap',
        sm && 'text-[3.5px] leading-normal tracking-widest'
      )}
    >
      <span className="flex-1 text-left">{children}</span>

      {showCard && <BlowCard size="xs" color="cyan" />}
    </div>
  )
}
