import {
  getResRejectedVoteRounds,
  getResRoundStatus,
} from '../../lib/res/res-engine'
import { range } from '../../lib/util/array'
import { useResGame } from '../../lib/util/use-game'
import ResRoundIndicator from './res-round-indicator'

export default function ResRoundTracker() {
  const { game } = useResGame()
  if (!game) return null

  return (
    <div className="div flex items-center space-x-2">
      <label>Rounds</label>
      {range(5).map((i) => (
        <ResRoundIndicator
          key={i}
          index={i}
          status={getResRoundStatus(game, i)}
          rejectedVoteRounds={getResRejectedVoteRounds(game, i)}
        />
      ))}
    </div>
  )
}
