import {
  createRandomNumberGenerator,
  createSeedHashGenerator,
  shuffle,
} from './random'

let _rng: () => number

const validatePrng = (caller: string): void => {
  if (!_rng) {
    throw new Error(`'${caller}': Random number generator not seeded.`)
  }
}

/**
 * Create a new pseudo-random number generator (PRNG) using a seed.
 * The PRNG will continue using this seed until this function is re-run
 * or the current runtime ends.
 */
export function setRandomNumberGeneratorSeed(seed: string): void {
  const hash = createSeedHashGenerator(seed)()
  _rng = createRandomNumberGenerator(hash)
}

export const prngShuffle = <T>(arr: T[]): T[] => {
  validatePrng('prngShuffle')
  return shuffle(arr, _rng)
}
