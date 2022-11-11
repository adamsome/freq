import { isTeamGuessGame } from '../../lib/game'
import { isResGameView } from '../../lib/res/res-game-view'
import useGame from '../../lib/util/use-game'
import ResDebugBar from './res-debug-bar'
import TeamDebugBar from './team-debug-bar'

const defaultProps = {}

const DebugBar = () => {
  const { game } = useGame()
  if (!game) return null

  if (isTeamGuessGame(game.type)) {
    return <TeamDebugBar game={game} />
  }

  if (isResGameView(game)) {
    return <ResDebugBar game={game} />
  }

  return null
}

DebugBar.defaultProps = defaultProps

export default DebugBar
