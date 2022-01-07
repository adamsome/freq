import type { ReactNode } from 'react'
import { PlayerView } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'

type Props = {
  children: ReactNode
  player?: PlayerView | null
}

export default function BlowPlayerSeatOutline({ children, player }: Props) {
  return (
    <div
      className={cx(
        'w-24 h-16 rounded',
        'font-narrow text-sm tracking-widest',
        'text-black/90 dark:text-white/90',
        {
          'px-1.5 pt-0.5 pb-px': player && !player.current,
          'px-1 pt-0.5 pb-px': player && player.current,
          border: player != null,
          'bg-gray-200 dark:bg-gray-800 flex-center': player === null,
        },
        player
          ? ['border-black dark:border-white']
          : 'border-gray-200 dark:border-gray-800',
        'border-opacity-20 dark:border-opacity-20',
        player?.current &&
          'border-2 border-opacity-30 dark:border-opacity-30 font-semibold'
      )}
    >
      {children}
    </div>
  )
}
