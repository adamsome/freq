import { PlayerView } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'

type Props = typeof defaultProps & {
  player?: PlayerView | null
}

const defaultProps = {}

export default function PlayerSeat({ player }: Props) {
  return (
    <div
      className={cx(
        'w-24 h-16 rounded',
        'font-narrow text-sm tracking-widest',
        'text-gray-700 dark:text-yellow-400',
        {
          'px-1.5 py-0.5': player,
          border: player != null,
          'bg-gray-200 dark:bg-gray-800 flex-center': player === null,
        },
        player
          ? [
              'border-gray-300 dark:border-white',
              'border-opacity-20 dark:border-opacity-20',
            ]
          : 'border-gray-200 dark:border-gray-800',
        player?.current &&
          'border-2 border-opacity-30 dark:border-opacity-30 font-semibold'
      )}
    >
      {player === null ? (
        <div className="text-overflow text-center text-gray-500">Empty</div>
      ) : player === undefined ? (
        <SkeletonBox className="w-full h-full" />
      ) : (
        <div className="text-overflow">{player.name}</div>
      )}
    </div>
  )
}

PlayerSeat.defaultProps = defaultProps
