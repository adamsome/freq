import { Clue, GameView } from '../types/game.types'
import { isBrowser } from '../util/dom'
import Meter from './meter'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps & {
  game: GameView
}

const defaultProps = {}

const GameBoard = ({ game }: Props) => {
  const { cluesToShow, playerGuesses } = game

  // TODO: Remove
  if (isBrowser) {
    // eslint-disable-next-line no-console
    console.log('game', game)
  }

  const handleGuessChange = (clue: Clue) => (guess: number) => {
    // TODO: Implement /guess
    // eslint-disable-next-line no-console
    console.log('guess', guess, clue)
  }

  return (
    <>
      {cluesToShow.map((clue, i) => (
        <div className="meter-wrapper" key={i}>
          <Meter
            clue={clue}
            players={playerGuesses}
            onGuessChange={handleGuessChange(clue)}
          ></Meter>
        </div>
      ))}

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

GameBoard.defaultProps = defaultProps

export default GameBoard
