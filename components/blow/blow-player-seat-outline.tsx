import type { ReactNode } from 'react'
import { cx } from '../../lib/util/dom'
import { BlowPlayerSeatProps } from './blow-player-seat'

type Props = BlowPlayerSeatProps & {
  children: ReactNode
}

export default function BlowPlayerSeatOutline(props: Props) {
  const {
    children,
    className,
    player,
    size = 'md',
    targetable,
    onClick,
  } = props

  const asButton = targetable && onClick
  const Component = asButton ? 'button' : 'div'

  return (
    <Component
      type={asButton ? 'button' : undefined}
      className={cx(className, {
        'flex-center': player === null,
        'h-16 w-24': size !== 'lg',
        'px-1.5 pt-0.5': size !== 'lg' && player && !player.current,
        'px-1 pt-0.5': size !== 'lg' && player && player.current,
        'pb-px': size !== 'lg' && player,
        'px-3 pt-1 xs:pt-2 xs:pb-3': player && size === 'lg',
        'font-narrow tracking-widest': true,
        'text-sm': true,
        'text-left': true,
        'text-black/90 dark:text-white/90': true,
        'font-semibold': player?.current,
        'bg-gray-200 dark:bg-gray-800': player === null,
        border: targetable || (size !== 'lg' && player && !player.current),
        'border-black dark:border-white': !targetable && player,
        'border-gray-200 dark:border-gray-800': !targetable && !player,
        'border-red-600 dark:border-red-500': targetable,
        'hover:border-red-800 dark:hover:border-red-400': targetable,
        'border-opacity-20 dark:border-opacity-20': !targetable,
        'border-2': !targetable && size !== 'lg' && player?.current,
        'border-opacity-30 dark:border-opacity-30':
          !targetable && player?.current,
        rounded: true,
        'focus:outline-none': true,
        'focus:ring-4 focus:ring-opacity-25 dark:focus:ring-opacity-25':
          targetable,
        'focus:ring-red-400 dark:focus:ring-red-500': targetable,
        'focus:border-red-700 dark:focus:border-red-400': targetable,
        transition: targetable,
        'cursor-pointer': onClick != null,
        shadow: size !== 'lg',
      })}
      onClick={(e) => {
        e.preventDefault()
        player != null && onClick?.(player)
      }}
    >
      {children}
    </Component>
  )
}
