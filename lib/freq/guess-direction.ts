import { getGuessesLocked, getGuessesSet } from '../guess'
import { getTeamPlayers } from '../player'
import { FreqGame } from '../types/freq.types'
import { Guess } from '../types/game.types'
import { Dict } from '../types/object.types'
import { partition } from '../util/array'

export function getDirectionGuessesNeeded(
  game: FreqGame,
  ...ignorePlayers: (string | { id: string })[]
): number {
  const { settings, players, team_turn, psychic } = game
  const team = team_turn === 1 ? 2 : 1
  // Add the designated psychic to ignore list if present
  const ignore = !settings?.designated_psychic
    ? ignorePlayers
    : [...ignorePlayers, psychic]
  return getTeamPlayers(players, team, ...ignore).length
}

export function areAllDirectionGuessesLocked(
  game: FreqGame,
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
