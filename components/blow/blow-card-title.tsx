import type { ReactNode } from 'react'
import { BlowThemeID } from '../../lib/types/blow.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import BlowCard, { BlowCardProps } from './blow-card'

type Props = BlowCardProps & {
  children: ReactNode
  className?: string
  theme?: BlowThemeID
}

export default function BlowCardTitle(props: Props) {
  const {
    children,
    className,
    size = 'sm',
    orientation = 'vertical',
    theme,
  } = props

  const sm = size === 'xs' || size === 'sm'
  const md = size === 'md'
  const lg = size === 'lg' || size === 'xl'

  return (
    <div
      className={cx(className, {
        relative: true,
        'flex-center space-x-1': true,
        'font-semibold w-full overflow-hidden whitespace-nowrap': true,
        'text-[3.5px] leading-normal': sm,
        'text-xs mt-1.5 ml-0': md && orientation === 'vertical',
        'tracking-normal': theme === 'magic',
        'text-lg ml-1': lg && orientation === 'vertical',
      })}
    >
      <span className="flex-1 text-left text-overflow">{children}</span>

      <Icons {...props} />
    </div>
  )
}

function Icons(props: Props) {
  const { currentCards = 0, theme } = props
  return (
    <div className={cx('flex-center', { 'pr-0.5': theme === 'magic' })}>
      {range(0, currentCards).map((i) => (
        <BlowCard key={i} size="xs" color="cyan" theme={theme} />
      ))}
    </div>
  )
}
