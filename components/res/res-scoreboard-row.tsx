import { getResPlayerIndex, isResLead } from '../../lib/res/res-engine'
import { Player } from '../../lib/types/game.types'
import { useResGame } from '../../lib/util/use-game'
import IconSvg from '../control/icon-svg'

type Props = {
  player: Player
}

export default function ResScoreboardRow({ player }: Props) {
  const { game } = useResGame()
  if (!game) return null

  const playerIndex = getResPlayerIndex(game, player)
  const lead = isResLead(game, player)

  return (
    <div className="flex w-full items-center">
      <div className="min-w-4 mr-3 w-4 text-center">
        {lead ? (
          <IconSvg name="chevron" className="text-phosphorus-500" top="-1px" />
        ) : (
          <span className="pl-0.5 text-gray-400/40">{playerIndex + 1}</span>
        )}
      </div>
      <div>{player.name}</div>
    </div>
  )
}
