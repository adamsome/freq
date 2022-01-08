import { objectKeys } from './object'

export function randomHourlyItem<T>(
  items: T[],
  index = 0,
  changePerHour = 1
): T {
  const now = new Date()
  const tick = now.getMinutes() + now.getHours() * 60 + now.getDate() * 24 * 60
  const cycle = Math.floor(tick / (60 / changePerHour))
  return items[(index + cycle) % items.length]
}

export function randomHourlyProp<T>(
  obj: T,
  index = 0,
  changePerHour = 1
): T[keyof T] {
  const keys = objectKeys(obj)
  const key = randomHourlyItem(keys, index, changePerHour)
  return obj[key]
}

export function randomItem<T>(arr: T[]): T {
  const index = (arr.length * Math.random()) << 0
  return arr[index]
}

export function randomProp<T>(obj: T): T[keyof T] {
  const keys = objectKeys(obj)
  const key = randomItem(keys)
  return obj[key]
}

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 *
 * @see https://stackoverflow.com/questions/49555273/how-to-shuffle-an-array-of-objects-in-javascript/
 */
export const shuffle = <T>(array: T[], rng = Math.random): T[] => {
  let i = array.length
  while (i--) {
    const ri = Math.floor(rng() * (i + 1))
    ;[array[i], array[ri]] = [array[ri], array[i]]
  }
  return array
}

/**
 * Given a simple seed string, generate a seed hash using MurmurHash3's
 * mixing function.
 *
 * @see https://stackoverflow.com/a/47593316/13188597
 */
export function createSeedHashGenerator(str: string) {
  // eslint-disable-next-line no-var
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

/**
 * Given a high-quality seed hash, return a pseudo-random number generator that
 * generators a pseudo-random number between 0 (inclusive) and 1 (exclusive)
 * usin the Mulberry32 algorithm.
 *
 * Use `createSeedHashGenerator(seedString)` to generator high-quality seed.
 *
 * @see https://stackoverflow.com/a/47593316/13188597
 */
export function createRandomNumberGenerator(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
