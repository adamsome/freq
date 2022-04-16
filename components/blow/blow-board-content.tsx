import { CommandError } from '../../lib/types/game.types'
import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardChallenge from './blow-board-challenge'
import BlowBoardPickLossCard from './blow-board-pick-loss-card'
import BlowBoardTurn from './blow-board-turn'
import BlowBoardWinner from './blow-board-winner'
import BlowRoleCardGrid from './blow-role-card-grid'

type Props = {
  className?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardContent(props: Props) {
  const { game } = useBlowGame()
  if (game?.challenge) {
    return <BlowBoardChallenge {...props} />
  }
  if (game?.winner) {
    return <BlowBoardWinner {...props} />
  }
  if (game?.pickLossCard) {
    return <BlowBoardPickLossCard {...props} />
  }
  if (game?.turn) {
    return <BlowBoardTurn {...props} />
  }
  return <BlowRoleCardGrid {...props} />
}
