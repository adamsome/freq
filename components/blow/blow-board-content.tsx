import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardChallenge from './blow-board-challenge'
import BlowBoardDrawCards from './blow-board-draw-cards'
import BlowBoardPickLossCard from './blow-board-pick-loss-card'
import BlowBoardWinner from './blow-board-winner'
import BlowRoleCardGrid from './blow-role-card-grid'

type Props = {
  className?: string
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
  if (game?.drawCards) {
    return <BlowBoardDrawCards />
  }
  return <BlowRoleCardGrid {...props} />
}
