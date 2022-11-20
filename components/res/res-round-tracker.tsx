import {
  getResMissionIndex,
  getResMissionStatus,
  getResRoundIndex,
  getResVoteStatus,
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
        'flow-root rounded border shadow-xl shadow-black/60 transition-all',
        'border-gray-400/10 bg-black/70 backdrop-blur-sm',
        className
      )}
    >
      <ul className="flex-center h-7 divide-x divide-gray-300/10">
        {range(5).map((i) => {
          const status = getResMissionStatus(game, i)
          const current = getResMissionIndex(game) === i
          const positive =
            status === 'success' &&
            (!current || game.phase === 'win' || game.step === 'mission_reveal')
          const negative =
            status === 'failure' ||
            (current &&
              game.phase === 'win' &&
              game.step === 'team_vote_reveal')
          const neutral =
            current && status === 'success' && game.step === 'mission'
          return (
            <li
              className={cx('flex-center h-full', current && 'flex-1')}
              key={i}
            >
              <ResRoundIndicator
                index={i}
                current={current}
                positive={positive}
                negative={negative}
                neutral={neutral}
                disabled={status === 'unplayed'}
                step={game.step}
                roundIndex={getResRoundIndex(game)}
                voteStatus={getResVoteStatus(game)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
