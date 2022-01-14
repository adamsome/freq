import type { ReactNode } from 'react'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import BlowCard, { BlowCardProps } from './blow-card'

type Props = BlowCardProps & {
  children: ReactNode
  className?: string
}

export default function BlowCardTitle(props: Props) {
  const { children, className, size = 'sm', orientation = 'vertical' } = props
  const sm = size === 'xs' || size === 'sm'

  return (
    <div
      className={cx(
        'relative',
        'flex-center space-x-1',
        'font-semibold w-full overflow-hidden whitespace-nowrap',
        sm && 'text-[3.5px] leading-normal tracking-widest',
        !sm && orientation === 'vertical' && 'text-lg ml-1',
        className
      )}
    >
      <span className="flex-1 text-left">{children}</span>

      <Icons {...props} />
    </div>
  )
}

function Icons(props: Props) {
  const { currentCards = 0 } = props
  return (
    <>
      {range(0, currentCards).map((i) => (
        <BlowCard key={i} size="xs" color="cyan" />
      ))}
    </>
  )
}
