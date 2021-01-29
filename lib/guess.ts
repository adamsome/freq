import { Game, Guess } from '../types/game.types'
import { Dict } from '../types/object.types'
import { partition } from '../util/array'
import { getTeamPlayers } from './player'

export function getGuessesLocked(guessDict: Dict<Guess> = {}): Guess[] {
  return Object.values(guessDict).filter((g) => g.locked == true)
}

export function getGuessesSet(guessDict: Dict<Guess> = {}): Guess[] {
  return Object.values(guessDict).filter((g) => g.value != null)
}

// Needle Guesses

export function getNeedleGuessesNeeded(
  game: Game,
  ...ignorePlayers: (string | { id: string })[]
): number {
  const { players, team_turn, psychic } = game
  return getTeamPlayers(players, team_turn, psychic, ...ignorePlayers).length
}

export function areAllNeedleGuessesLocked(
  game: Game,
  ...ignorePlayers: (string | { id: string })[]
): boolean {
  const guessesNeeded = getNeedleGuessesNeeded(game, ...ignorePlayers)
  const guesses = getGuessesLocked(game.guesses)
  return guesses.length >= guessesNeeded
}

export function calculateAverageNeedleGuess(
  needleGuessDict: Dict<Guess> = {}
): number | undefined {
  const guessVals = getGuessesSet(needleGuessDict).map((g) => g.value)
  const sum = guessVals.reduce((acc, g) => acc + g, 0)
  return sum / guessVals.length
}

// Direction Guesses

export function getDirectionGuessesNeeded(
  game: Game,
  ...ignorePlayers: (string | { id: string })[]
): number {
  const { players, team_turn } = game
  const team = team_turn === 1 ? 2 : 1
  return getTeamPlayers(players, team, ...ignorePlayers).length
}

export function areAllDirectionGuessesSet(
  game: Game,
  ...ignorePlayers: (string | { id: string })[]
): boolean {
  const guessesNeeded = getDirectionGuessesNeeded(game, ...ignorePlayers)
  const guesses = getGuessesSet(game.directions)
  return guesses.length >= guessesNeeded
}

export function getDirectionCounts(
  guessDict: Dict<Guess> = {}
): [number, number] {
  const guessVals = getGuessesSet(guessDict).map((g) => g.value)
  const [left, rest] = partition((val) => val === -1, guessVals)
  const right = rest.filter((val) => val === 1)
  return [left.length, right.length]
}

export function calculateAverageDirectionGuess(
  guessDict: Dict<Guess> = {}
): -1 | 1 {
  const [left, right] = getDirectionCounts(guessDict)
  return left > right ? -1 : 1
}
