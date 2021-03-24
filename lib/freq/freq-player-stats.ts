import { FreqGame, FreqPlayerStats } from '../../types/freq.types'
import { Dict } from '../../types/object.types'
import { calculateAverageDirectionGuess } from './guess-direction'
import { calculateAverageNeedleGuess } from './guess-needle'

export function createFreqPlayerStats(id: string): FreqPlayerStats {
  return {
    updated_at: new Date().toISOString(),
    id,
    gp: 0,
    w: 0,
    pn: 0,
    p4: 0,
    p3: 0,
    p2: 0,
    gn: 0,
    g4: 0,
    g3: 0,
    g2: 0,
    gt4: 0,
    gt3: 0,
    gt2: 0,
    dn: 0,
    d1: 0,
    dt1: 0,
  }
}

export function sumFreqPlayerStats(
  a: FreqPlayerStats,
  b: FreqPlayerStats
): FreqPlayerStats {
  return Object.keys(a).reduce(
    (acc, key) => {
      const k = key as keyof FreqPlayerStats
      if (k !== 'id' && k !== 'updated_at') {
        acc[k] = (a[k] ?? 0) + (b[k] ?? 0)
      }
      return acc
    },
    { id: a.id, updated_at: new Date().toISOString() } as FreqPlayerStats
  )
}

export function calculateFreqPlayerPoints(stats?: FreqPlayerStats): number {
  if (!stats) return 0

  return (
    stats.d1 +
    stats.g2 * 2 +
    stats.g3 * 3 +
    stats.g4 * 4 +
    stats.p2 * 4 +
    stats.p3 * 6 +
    stats.p4 * 8
  )
}

const makeGetGuessScore = (target: number, target_width: number) => (
  guess: number
): 0 | 2 | 3 | 4 => {
  // Target width is as a percent vs guess & target, which are decimals
  // Target is broken up into 5 bands
  const bandWidth = target_width / 100 / 5
  const guessDiff = target - guess

  if (Math.abs(guessDiff) <= 0.5 * bandWidth) {
    return 4 // Center band gets top score
  } else if (Math.abs(guessDiff) <= 1.5 * bandWidth) {
    return 3 // 2nd middle bands get middle score
  } else if (Math.abs(guessDiff) <= 2.5 * bandWidth) {
    return 2 // Outer bands get low score
  }
  return 0
}

const makeGetDirectionScore = (
  guessScore: 0 | 2 | 3 | 4,
  directionActual: -1 | 1
) => (directionGuess: -1 | 0 | 1): 0 | 1 => {
  // Opposing team gets 0 if guessing team hits the center band
  return guessScore !== 4 &&
    directionGuess !== 0 &&
    directionGuess === directionActual
    ? 1
    : 0
}

export interface FreqRoundStats {
  roundStats: Dict<FreqPlayerStats>
  scoreTeam1: number
  scoreTeam2: number
}

export function generateFreqRoundStats({
  guesses,
  directions,
  target_width,
  target,
  players,
  team_turn,
  psychic,
}: FreqGame): FreqRoundStats {
  if (!target)
    throw new Error('Unexpected error: no target while getting round scores.')

  const averageGuess = calculateAverageNeedleGuess(guesses) ?? 0.5
  const averageDirection = calculateAverageDirectionGuess(directions)
  const actualDirection = target < averageGuess ? -1 : 1

  const getGuessScore = makeGetGuessScore(target, target_width)
  const teamGuessScore = getGuessScore(averageGuess)

  const getDirectionScore = makeGetDirectionScore(
    teamGuessScore,
    actualDirection
  )
  const teamDirectionScore = getDirectionScore(averageDirection)

  const roundStats = players.reduce((acc, p) => {
    const stats = createFreqPlayerStats(p.id)

    if (p.id === psychic) {
      stats.pn++
      if (teamGuessScore === 2) stats.p2++
      if (teamGuessScore === 3) stats.p3++
      if (teamGuessScore === 4) stats.p4++
    } else if (p.team === team_turn) {
      if (teamGuessScore === 2) stats.gt2++
      if (teamGuessScore === 3) stats.gt3++
      if (teamGuessScore === 4) stats.gt4++

      const guess = guesses?.[p.id]?.value
      if (guess) {
        const guessScore = getGuessScore(guess)
        stats.gn++
        if (guessScore === 2) stats.g2++
        if (guessScore === 3) stats.g3++
        if (guessScore === 4) stats.g4++
      }
    } else {
      if (teamDirectionScore === 1) stats.dt1++

      const direction = directions?.[p.id]?.value
      if (direction === 1 || direction === -1) {
        const directionScore = getDirectionScore(direction)
        stats.dn++
        if (directionScore === 1) stats.d1++
      }
    }

    acc[p.id] = stats
    return acc
  }, {} as Dict<FreqPlayerStats>)

  return {
    roundStats,
    scoreTeam1: team_turn === 1 ? teamGuessScore : teamDirectionScore,
    scoreTeam2: team_turn === 2 ? teamGuessScore : teamDirectionScore,
  }
}
