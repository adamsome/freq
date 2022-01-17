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
  const md = size === 'md'
  const lg = size === 'lg' || size === 'xl'

  return (
    <div
      className={cx(className, {
        relative: true,
        'flex-center space-x-1': true,
        'font-semibold w-full overflow-hidden whitespace-nowrap': true,
        'text-[3.5px] leading-normal tracking-widest': sm,
        'text-xs tracking-widest mt-1.5 ml-0': md && orientation === 'vertical',
        'text-lg ml-1': lg && orientation === 'vertical',
      })}
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
