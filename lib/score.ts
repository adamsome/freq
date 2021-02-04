import { Game } from '../types/game.types'
import { Dict } from '../types/object.types'
import {
  calculateAverageDirectionGuess,
  calculateAverageNeedleGuess,
} from './guess'
import { getPlayersPerTeam } from './player'

function getRoundScores({
  players,
  psychic,
  target_width,
  team_turn,
  guesses,
  directions,
  target,
}: Game): [number, number, Dict<number>] {
  if (!target)
    throw new Error('Unexpected error: no target while getting round scores.')

  const averageGuess = calculateAverageNeedleGuess(guesses) ?? 0.5

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
    const dir = calculateAverageDirectionGuess(directions)
    if (dir === -1 && target < averageGuess) {
      directionScore = 1
    } else if (dir === 1 && target > averageGuess) {
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

interface ScoreState {
  round: readonly [number, number]
  total: readonly [number, number]
  perPlayer: { index: number; score: number; wins: number }[]
  win: boolean
  repeatTurn: boolean
}

export function getScoreState(game: Game): ScoreState {
  const [round1, round2, roundByPlayer] = getRoundScores(game)
  const round = [round1, round2] as const

  const total1 = game.score_team_1 + round1
  const total2 = game.score_team_2 + round2
  const total = [total1, total2] as const

  const tied = total1 === total2
  const win1 = !tied && total1 >= 10
  const win2 = !tied && total2 >= 10
  const win = win1 || win2
  const repeatTurn =
    (round1 === 4 && total1 < total2) || (round2 === 4 && total1 > total2)

  const perPlayer = game.players.map((p, index) => {
    let wins = p.wins
    if ((p.team === 1 && win1) || (p.team === 2 && win2)) {
      wins++
    }
    const score = (roundByPlayer[p.id] ?? 0) + (p.score ?? 0)
    return { index, score, wins }
  })

  return { round, total, perPlayer, win, repeatTurn }
}
