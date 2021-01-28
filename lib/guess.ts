import { Game, Guess, Player } from '../types/game.types'
import { Dict } from '../types/object.types'
import { getTeamPlayers } from './player'

function _areAllGuesses(
  game: Game,
  useOpposingTeam = false,
  requireLock = false,
  ...ignorePlayers: Player[]
): boolean {
  const { players, psychic, team_turn } = game
  const team = !useOpposingTeam ? team_turn : team_turn === 1 ? 2 : 1
  const guessers = getTeamPlayers(players, team, psychic, ...ignorePlayers)
  for (const guesser of guessers) {
    const guess = game.guesses?.[guesser.id]
    if (requireLock && !guess?.locked) {
      return false
    }
    if (!requireLock && guess?.value == null) {
      return false
    }
  }
  return true
}

export function areAllNeedleGuessesLocked(
  game: Game,
  ...ignorePlayers: Player[]
): boolean {
  return _areAllGuesses(game, false, true, ...ignorePlayers)
}

export function areAllDirectionGuessesSet(
  game: Game,
  ...ignorePlayers: Player[]
): boolean {
  return _areAllGuesses(game, true, false, ...ignorePlayers)
}

interface GuessInfo {
  numNeeded: number
  numSet: number
  numLocked: number
  guesses: Guess[]
}

export function getGuessInfo(
  players: Player[],
  psychic: string,
  guesses?: Dict<Guess>,
  team?: 1 | 2
): GuessInfo {
  const guessers = getTeamPlayers(players, team, psychic)
  const numNeeded = guessers.length
  return guessers.reduce(
    (acc, p) => {
      const guess: Guess | undefined = guesses?.[p.id]
      if (guess?.value != null) {
        if (guess?.locked === true) {
          acc.numLocked++
        }
        acc.numSet++
        acc.guesses.push(guess)
      }
      return acc
    },
    { numNeeded, numSet: 0, numLocked: 0, guesses: [] } as GuessInfo
  )
}

export function calculateAverageGuess(
  players: Player[],
  team_turn: 1 | 2 | undefined,
  guesses?: Dict<Guess>
): number | undefined {
  const guessingTeam = players.filter((p) => p.team === team_turn)
  const teamGuesses = guessingTeam.reduce((acc, p) => {
    const guess = guesses?.[p.id]
    if (guess) {
      acc.push(guess.value)
    }
    return acc
  }, [] as number[])
  const sum = teamGuesses.reduce((acc, g) => acc + g, 0)
  return sum / teamGuesses.length
}
