import { FreqGame } from '../../types/freq.types'
import { Guess } from '../../types/game.types'
import { Dict } from '../../types/object.types'
import { getGuessesLocked, getGuessesSet } from '../guess'
import { getTeamPlayers } from '../player'

export function getNeedleGuessesNeeded(
  game: FreqGame,
  ...ignorePlayers: (string | { id: string })[]
): number {
  const { settings, players, team_turn, psychic } = game
  // Add the designated psychic to ignore list if present
  const ignore = !settings?.designated_psychic
    ? ignorePlayers
    : [...ignorePlayers, psychic]
  return getTeamPlayers(players, team_turn, psychic, ...ignore).length
}

export function areAllNeedleGuessesLocked(
  game: FreqGame,
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
