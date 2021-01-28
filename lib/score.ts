import { Game, Guess, Player } from '../types/game.types'
import { Dict } from '../types/object.types'
import { partition } from '../util/array'
import { calculateAverageGuess, getGuessInfo } from './guess'
import { getPlayersPerTeam } from './player'

export function getRoundScores(game: Game): [number, number, Dict<number>]
export function getRoundScores(
  players: Player[],
  psychic: string,
  target_width: number,
  team_turn: 1 | 2 | undefined,
  guessesDict: Dict<Guess> | undefined,
  target: number | undefined
): [number, number, Dict<number>]
export function getRoundScores(
  gameOrPlayers: Player[] | Game,
  psychic?: string,
  target_width?: number,
  team_turn?: 1 | 2 | undefined,
  guessesDict?: Dict<Guess> | undefined,
  target?: number
): [number, number, Dict<number>] {
  if (Array.isArray(gameOrPlayers)) {
    if (!psychic || !target_width) {
      throw new TypeError('getRoundScores is missing required parameters.')
    }
    return _getRoundScores(
      gameOrPlayers,
      psychic,
      target_width,
      team_turn,
      guessesDict,
      target
    )
  }
  const g = gameOrPlayers
  return _getRoundScores(
    g.players,
    g.psychic,
    g.target_width,
    g.team_turn,
    g.guesses,
    g.target
  )
}

function _getRoundScores(
  players: Player[],
  psychic: string,
  target_width: number,
  team_turn: 1 | 2 | undefined,
  guessesDict: Dict<Guess> | undefined,
  target: number | undefined
): [number, number, Dict<number>] {
  if (!target)
    throw new Error('Unexpected error: no target while getting round scores.')

  const averageGuess =
    calculateAverageGuess(players, team_turn, guessesDict) ?? 0.5

  // Target width is as a percent vs guess & target, which are decimals
  // Target is broken up into 5 bands
  const bandWidth = target_width / 100 / 5
  const guessDiff = target - averageGuess

  let guessScore = 0
  if (Math.abs(guessDiff) <= 0.5 * bandWidth) {
    guessScore = 4 // Center band gets top score
  } else if (Math.abs(guessDiff) <= 1.5 * bandWidth) {
    guessScore = 3 // 2nd middle bands get middle score
  } else if (Math.abs(guessDiff) <= 2.5 * bandWidth) {
    guessScore = 2 // Outer bands get low score
  }

  let directionScore = 0
  // Opposing team gets 0 if guessing team hits the center band
  if (guessScore !== 4) {
    const { guesses } = getGuessInfo(
      players,
      psychic,
      guessesDict,
      team_turn === 1 ? 2 : 1
    )
    const leftVsRight = partition((g) => g.value === -1, guesses)
    const [numLeft, numRight] = leftVsRight.map((xs) => xs.length)

    if (numLeft > numRight && target < averageGuess) {
      directionScore = 1
    } else if (numLeft < numRight && target > averageGuess) {
      directionScore = 1
    }
  }

  const allPlayers = getPlayersPerTeam(players)
  const guessPlayers = allPlayers[team_turn === 1 ? 0 : 1]
  const directionPlayers = allPlayers[team_turn === 1 ? 1 : 0]

  const scoreByPlayer: Dict<number> = {}

  for (const p of guessPlayers) {
    if (p.id === psychic) {
      scoreByPlayer[p.id] = guessScore / 2
    } else {
      scoreByPlayer[p.id] = guessScore / 2 / (guessPlayers.length - 1)
    }
  }
  for (const p of directionPlayers) {
    scoreByPlayer[p.id] = directionScore / directionPlayers.length
  }

  return team_turn === 1
    ? [guessScore, directionScore, scoreByPlayer]
    : [directionScore, guessScore, scoreByPlayer]
}
