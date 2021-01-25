import { mutate } from 'swr'
import useGame from '../hooks/use-game'
import fetchJson from '../util/fetch-json'
import ActionPanel from './action-panel'
import Meter from './meter'
import Scoreboard from './scoreboard'

const GameBoard = () => {
  const [game] = useGame()
  if (!game) return null

  const { cluesToShow, playerGuesses } = game

  const handleGuessChange = async (guess: number) => {
    try {
      await fetchJson('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess }),
      })
      mutate('/api/game')
    } catch (error) {
      console.error('Error updating guess.', error)
    }
  }

  return (
    <>
      {cluesToShow.map((clue, i) => (
        <div className="meter-wrapper" key={i}>
          <Meter
            clue={clue}
            players={playerGuesses}
            onGuessChange={handleGuessChange}
          ></Meter>
        </div>
      ))}

      <ActionPanel />

      <Scoreboard game={game} />

      <style jsx>{`
        .meter-wrapper {
          width: 100%;
          height: 200px;
          margin-bottom: var(--stack-lg);
        }

        pre {
          font-family: var(--font-family-mono);
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default GameBoard
