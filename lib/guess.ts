import { Game, Guess } from '../types/game.types'
import { Dict } from '../types/object.types'
import { partition } from '../util/array'
import { getTeamPlayers } from './player'

export function getGuessesLocked(dict: Dict<Guess> = {}): Guess[] {
  return Object.values(dict).filter((g) => g.locked === true)
}

export function getGuessesSet(dict: Dict<Guess> = {}): Guess[] {
  return Object.values(dict).filter((g) => g.value != null)
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
  dict: Dict<Guess> = {}
): number | undefined {
  const guessVals = getGuessesSet(dict).map((g) => g.value)
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

export function areAllDirectionGuessesLocked(
  game: Game,
  ...ignorePlayers: (string | { id: string })[]
): boolean {
  const guessesNeeded = getDirectionGuessesNeeded(game, ...ignorePlayers)
  const guesses = getGuessesLocked(game.directions)
  return guesses.length >= guessesNeeded
}

export function getDirectionCounts(
  dict: Dict<Guess> = {},
  locked = false
): [number, number] {
  const guesses = locked ? getGuessesLocked(dict) : getGuessesSet(dict)
  const guessVals = guesses.map((g) => g.value)
  const [left, rest] = partition((val) => val === -1, guessVals)
  const right = rest.filter((val) => val === 1)
  return [left.length, right.length]
}

export function calculateAverageDirectionGuess(
  dict: Dict<Guess> = {}
): -1 | 1 | 0 {
  const [left, right] = getDirectionCounts(dict, true)
  return left > right ? -1 : left < right ? 1 : 0
}
