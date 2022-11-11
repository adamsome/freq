import {
  getResPlayersInOrder,
  isResTeamMember,
  isResLead,
  isResSpy,
  isResTeamRequiredSize,
  getResPlayerVoteStatus,
} from '../../lib/res/res-engine'
import { Player } from '../../lib/types/game.types'
import { useResGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import HeaderMessage from '../header-message'
import ResPlayerCard from './res-player-card'
import ResRoundTracker from './res-round-tracker'

type Props = {
  onPlayerSelect: (player: Player) => void
}

// TODO: Disable select if team size is reached (and ignore on server side) and
//       enable start_vote button
export default function ResBoard({ onPlayerSelect }: Props) {
  const { game } = useResGame()
  if (!game) return null

  const isTeamSelect = game.step === 'team_select'
  const isTeamRequiredSize = isResTeamRequiredSize(game)

  return (
    <div className="p-4">
      <ResRoundTracker />
      <div>{game.phase === 'guess' ? game.step : game.phase}</div>

      <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-4">
        {getResPlayersInOrder(game).map((player) => {
          const selected = isResTeamMember(game, player)
          const selectable = isTeamSelect && (selected || !isTeamRequiredSize)
          return (
            <ResPlayerCard
              key={player.id}
              player={player}
              lead={isResLead(game, player)}
              current={player.id === game.currentPlayer?.id}
              spy={isResSpy(game, player)}
              selectable={selectable}
              selected={selected}
              voteStatus={getResPlayerVoteStatus(game, player)}
              onSelect={onPlayerSelect}
            />
          )
        })}
      </div>

      <HeaderMessage />
      <CommandPanel />
    </div>
  )
}
