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

export function randomHourlyProp<T>(obj: T, index = 0, changePerHour = 1) {
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
export const shuffle = <T>(array: T[]) => {
  let i = array.length
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[ri]] = [array[ri], array[i]]
  }
  return array
}
