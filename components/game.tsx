import useGame from '../hooks/use-game'
import CluesContainer from './clues-container'
import CommandPanel from './command-panel'
import GameLink from './game-link'
import HeaderMessage from './header-message'
import PlayerHero from './player-hero'
import Scoreboard from './scoreboard'

export default function Game() {
  const { game } = useGame()
  if (!game) return null

  const { phase, currentPlayer } = game
  if (!currentPlayer) return null

  const roomUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${game.room}`

  return (
    <>
      <HeaderMessage />

      {phase === 'prep' && (
        <>
          <GameLink url={roomUrl} />
          {game.currentPlayer && <PlayerHero />}
        </>
      )}

      <CluesContainer />
      <CommandPanel />

      <Scoreboard />
    </>
  )
}
