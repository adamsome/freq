import { GameView } from '../types/game.types'
import Meter from './meter'

type Props = typeof defaultProps & {
  player_id: string
  game: GameView
}

const defaultProps = {}

const GameBoard = ({ game }: Props) => {
  const { cluesToShow, playerGuesses } = game

  return (
    <>
      {cluesToShow.map((clue, i) => (
        <div className="meter-wrapper" key={i}>
          <Meter clue={clue} players={playerGuesses}></Meter>
        </div>
      ))}

      <p>Meter {`'${game.game_id} - ${game.game_started_at}`}</p>

      <style jsx>{`
        .meter-wrapper {
          width: 100%;
          height: 200px;
          margin-bottom: var(--stack-lg);
        }
      `}</style>
    </>
  )
}

GameBoard.defaultProps = defaultProps

export default GameBoard
