import { isNil } from './assertion'

export function asArray<T>(arrayOrElement?: T | T[] | null): T[] | undefined {
  if (arrayOrElement != null) {
    return Array.isArray(arrayOrElement) ? arrayOrElement : [arrayOrElement]
  }
}

export function head<T>(arrayOrElement?: T | T[] | null): T | undefined {
  const array = asArray(arrayOrElement)
  return array != null && array.length ? array[0] : undefined
}

export function nth(offset: number, arr: string): string
export function nth<T>(offset: number, arr: T[]): T
export function nth<T>(offset: number, arr: string | T[]): T | string {
  const idx = offset < 0 ? arr.length + offset : offset
  return typeof arr === 'string' ? arr.charAt(idx) : arr[idx]
}

/**
 * Takes a predicate and a list of values and returns a a tuple (2-item array),
 *  with each item containing the subset of the list that matches the predicate
 *  and the complement of the predicate respectively
 *
 * @sig (T -> Boolean, T[]) -> [T[], T[]]
 *
 * @param {Function} predicate A predicate to determine which side the element belongs to.
 * @param {Array} arr The list to partition
 *
 * Inspired by the Ramda function of the same name
 * @see https://ramdajs.com/docs/#partition
 *
 * @see https://gist.github.com/zachlysobey/71ac85046d0d533287ed85e1caa64660
 *
 * @example
 *
 *     const isNegative: (n: number) => boolean = n => n < 0
 *     const numbers = [1, 2, -4, -7, 4, 22]
 *     partition(isNegative, numbers)
 *     // => [ [-4, -7], [1, 2, 4, 22] ]
 */
export function partition<T>(
  predicate: (val: T) => boolean,
  arr: Array<T>
): [Array<T>, Array<T>] {
  const partitioned: [Array<T>, Array<T>] = [[], []]
  arr.forEach((val: T) => {
    const partitionIndex: 0 | 1 = predicate(val) ? 0 : 1
    partitioned[partitionIndex].push(val)
  })
  return partitioned
}

export function randomItem<T>(arr: T[]): T {
  const index = (arr.length * Math.random()) << 0
  return arr[index]
}

export const reject = <T>(arr: T[], fn: (value: T) => boolean): T[] => {
  return arr.filter((it) => !fn(it))
}

export const rejectNil = <T>(list: Array<T | undefined | null>): T[] =>
  reject(list, isNil)

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 *
 * @see https://stackoverflow.com/questions/49555273/how-to-shuffle-an-array-of-objects-in-javascript/
 */
export const shuffle = <T>(array: T[]) => {
  let i = array.length
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[ri]] = [array[ri], array[i]]
  }
  return array
}
