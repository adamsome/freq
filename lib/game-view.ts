import { Clue, Game, GameView, Phase } from '../types/game.types'
import { Guess } from '../types/guess.types'
import { HasObjectID } from '../types/io.types'
import { Dict } from '../types/object.model'
import { Player, PlayerWithGuess } from '../types/player.types'
import { omitID } from '../util/mongodb'

function createPlayerGuesses(
  userID: string,
  players: Player[],
  guesses: Dict<Guess>
): PlayerWithGuess[] {
  const { player, otherPlayers } = players.reduce(
    (acc, p) => {
      const guess = guesses[p.id]

      if (p.id === userID) {
        acc.player = { ...p, guess: guess ?? 0.5 }
      } else if (guess) {
        acc.otherPlayers.push({ ...p, guess })
      }
      return acc
    },
    { otherPlayers: [] } as {
      player?: PlayerWithGuess
      otherPlayers: PlayerWithGuess[]
    }
  )
  if (!player) {
    throw new Error(
      `Expected one of Game's players to match '${userID}' ` +
        `while creating player guesses.`
    )
  }
  return [player, ...otherPlayers]
}

function createCluesToShow(
  phase: Phase,
  clues: Clue[],
  selected?: number
): Clue[] {
  switch (phase) {
    case 'prep':
      return []
    case 'choose':
      return clues
    default:
      return selected != null ? [clues[selected]] : clues
  }
}

export function toGameView(
  userID: string,
  game: Game & Partial<HasObjectID>
): GameView {
  const { phase, clues, clue_selected, players, guesses } = game

  const currentPlayer = players.find((p) => p.id === userID)
  if (!currentPlayer) {
    throw new Error(
      `Unexpected error: Game has no player with user ID '${userID}'`
    )
  }

  const cluesToShow = createCluesToShow(phase, clues, clue_selected)
  const playerGuesses = createPlayerGuesses(userID, players, guesses)

  const view: GameView & Partial<HasObjectID> = {
    ...game,
    currentPlayer,
    cluesToShow,
    playerGuesses,
  }
  return omitID(view)
}
