import { BlowGame } from '../types/blow.types'
import {
  createRandomNumberGenerator,
  createSeedHashGenerator,
  shuffle,
} from '../util/random'

let _rng: () => number

export function seedBlowRandomNumberGenerator(game: BlowGame): void {
  const date = game.match_started_at ?? new Date().toISOString()
  const seed = `${game.match_number}_${date}_${game.room}`
  const hash = createSeedHashGenerator(seed)()
  _rng = createRandomNumberGenerator(hash)
}

export const blowShuffle = <T>(arr: T[]): T[] => {
  if (!_rng) {
    throw new Error(`'blowShuffle': Random number generator not seeded.`)
  }
  return shuffle(arr, _rng)
}
