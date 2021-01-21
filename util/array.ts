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

export function randomItem<T>(arr: T[]): T {
  const index = (arr.length * Math.random()) << 0
  return arr[index]
}

export const reject = <T>(arr: T[], fn: (value: T) => boolean): T[] => {
  return arr.filter((it) => !fn(it))
}

export const rejectNil = <T>(list: Array<T | undefined | null>): T[] =>
  reject(list, isNil)
