import {
  getResRejectedVoteRounds,
  getResMissionStatus,
  getResMissionIndex,
} from '../../lib/res/res-engine'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { useResGame } from '../../lib/util/use-game'
import ResRoundIndicator from './res-round-indicator'

type Props = {
  className?: string
}

export default function ResRoundTracker({ className }: Props) {
  const { game } = useResGame()
  if (!game) return null

  return (
    <div
      className={cx(
        'flow-root rounded border shadow-xl shadow-black/60',
        'border-gray-400/10 bg-black/70 backdrop-blur-sm',
        className
      )}
    >
      <ul className="flex items-center divide-x divide-gray-300/10">
        {range(5).map((i) => {
          const status = getResMissionStatus(game, i)
          const current = getResMissionIndex(game) === i
          return (
            <li className={cx('px-2', current && 'flex-auto')} key={i}>
              <ResRoundIndicator
                index={i}
                current={current}
                status={status}
                rejectedVoteRounds={getResRejectedVoteRounds(game, i)}
                step={game.step}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
