import { Game } from '../types/game.types'
import { Dict } from '../types/object.model'
import { Player, PlayerGuess } from '../types/player.types'

const createPlayerGuesses = (
  player_id: string,
  players: Player[],
  guesses: Dict<number>
): PlayerGuess[] => {
  const { player, otherPlayers } = players.reduce(
    (acc, p) => {
      const guess = guesses[p.player_id]

      if (p.player_id === player_id) {
        acc.player = { ...p, guess: guess ?? 0.5 }
      } else if (guess) {
        acc.otherPlayers.push({ ...p, guess })
      }
      return acc
    },
    { otherPlayers: [] } as {
      player?: PlayerGuess
      otherPlayers: PlayerGuess[]
    }
  )
  if (!player) {
    throw new Error(
      `Expected one of Game's players to match '${player_id}' ` +
        `while creating player guesses.k`
    )
  }
  return [player, ...otherPlayers]
}

export function createGameView(player_id: string, game: Game) {
  const { clues, clue_selected, players, guesses } = game
  const cluesToShow = clue_selected == null ? clues : [clues[clue_selected]]
  const playerGuesses = createPlayerGuesses(player_id, players, guesses)
  const gameView = {
    ...game,
    cluesToShow,
    playerGuesses,
  }

  return gameView
}
