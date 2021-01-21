import { Game } from '../types/game.types'
import { PlayerGuess } from '../types/player.types'
import Meter from './meter'

type Props = typeof defaultProps & {
  player_id: string
  game: Game
}

const defaultProps = {}

const GameBoard = ({ player_id, game }: Props) => {
  const { clues, clue_selected, players, guesses } = game

  const cluesToShow = clue_selected == null ? clues : [clues[clue_selected]]

  const { player, otherPlayers } = players.reduce(
    (acc, p) => {
      const guess = guesses[p.player_id]
      if (guess) {
        const playerGuess = { ...p, guess }
        if (p.player_id === player_id) {
          acc.player = playerGuess
        } else {
          acc.otherPlayers.push(playerGuess)
        }
      }
      return acc
    },
    { otherPlayers: [] } as {
      player?: PlayerGuess
      otherPlayers: PlayerGuess[]
    }
  )

  const playerGuesses = players
    .map((p) => ({ ...p, guess: guesses[p.player_id] }))
    .filter((p) => p.guess != null)
  // eslint-disable-next-line no-console
  console.log('pg', playerGuesses, players, guesses)

  return (
    <>
      {cluesToShow.map((clue, i) => (
        <div className="meter-wrapper" key={i}>
          <Meter
            clue={clue}
            player={player}
            otherPlayers={otherPlayers}
          ></Meter>
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
