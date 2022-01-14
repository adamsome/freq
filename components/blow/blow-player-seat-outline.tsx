import type { ReactNode } from 'react'
import { cx } from '../../lib/util/dom'
import { BlowPlayerSeatProps } from './blow-player-seat'

type Props = BlowPlayerSeatProps & {
  children: ReactNode
}

export default function BlowPlayerSeatOutline(props: Props) {
  const { children, className, player, size = 'md' } = props
  return (
    <div
      className={cx(className, {
        'flex-center': player === null,
        'w-24 h-16': size !== 'lg',
        'px-1.5 pt-0.5': size !== 'lg' && player && !player.current,
        'px-1 pt-0.5': size !== 'lg' && player && player.current,
        'pb-px': size !== 'lg' && player,
        'px-3 pt-1 xs:pt-2 xs:pb-3': player && size === 'lg',
        'font-narrow tracking-widest': true,
        'text-sm': true,
        'text-black/90 dark:text-white/90': true,
        'font-semibold': player?.current,
        'bg-gray-200 dark:bg-gray-800': player === null,
        border: size !== 'lg' && player && !player.current,
        'border-black dark:border-white': player,
        'border-gray-200 dark:border-gray-800': !player,
        'border-opacity-20 dark:border-opacity-20': true,
        'border-2': size !== 'lg' && player?.current,
        'border-opacity-30 dark:border-opacity-30': player?.current,
        shadow: size !== 'lg',
        rounded: true,
      })}
    >
      {children}
    </div>
  )
}
