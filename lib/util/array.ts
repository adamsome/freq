import { WithIndex } from '../types/object.types'
import { isNil } from './assertion'

export function arrayEquals<T>(a?: T[], b?: T[]): boolean {
  if (a === b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function asArray<T>(arrayOrElement?: T | T[] | null): T[] | undefined {
  if (arrayOrElement != null) {
    return Array.isArray(arrayOrElement) ? arrayOrElement : [arrayOrElement]
  }
}

export function head<T>(arrayOrElement?: T | T[] | null): T | undefined {
  const array = asArray(arrayOrElement)
  return array != null && array.length ? array[0] : undefined
}

export function insertLimited<T>(
  it: T | (T | undefined | null)[] | undefined | null,
  arr: T[] | undefined,
  limit = 10
): T[] {
  let _arr = arr ? [...arr] : []
  if (it == null) return _arr
  if (Array.isArray(it)) {
    _arr = [...rejectNil(it), ..._arr]
    return _arr.slice(0, limit)
  }
  return [it, ..._arr].slice(0, limit)
}

export function nth(offset: number, arr: string): string
export function nth<T>(offset: number, arr: readonly T[]): T
export function nth<T>(offset: number, arr: string | readonly T[]): T | string {
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

export const range = (from: number, to: number): number[] => {
  const result = []
  let n = from
  while (n < to) {
    result.push(n)
    n += 1
  }
  return result
}

export const reject = <T>(arr: T[], fn: (value: T) => boolean): T[] => {
  return arr.filter((it) => !fn(it))
}

export const rejectNil = <T>(list: Array<T | undefined | null>): T[] =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  reject(list, isNil)

export function reverse(arrayOrElement: null | undefined): undefined
export function reverse<T>(arrayOrElement: T | T[]): T[]
export function reverse<T>(
  arrayOrElement: T | T[] | null | undefined
): T[] | undefined {
  const array = asArray(arrayOrElement)
  return array != null && array.length ? array.slice().reverse() : undefined
}

export function tail(arrayOrElement: null | undefined): undefined
export function tail<T>(arrayOrElement: T | T[]): T[]
export function tail<T>(
  arrayOrElement: T | T[] | null | undefined
): T[] | undefined {
  const array = asArray(arrayOrElement)
  return array != null && array.length ? array.slice(1) : undefined
}

export function shiftOrder<T>(arr: T[], newStartIndex: number): T[] {
  return arr.slice(newStartIndex).concat(arr.slice(0, newStartIndex))
}

export const createPropComparer =
  <T, P>(accessor: (obj: T) => P, order: 'asc' | 'desc' = 'asc') =>
  (a: T, b: T) => {
    const pa = accessor(a)
    const pb = accessor(b)

    if (order === 'desc') return pa < pb ? 1 : pa > pb ? -1 : 0
    return pa < pb ? -1 : pa > pb ? 1 : 0
  }

export const withIndexComparer = createPropComparer(
  (m: WithIndex<unknown>) => m.index
)
