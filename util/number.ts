export function countBinaryOnes(n: number): number {
  let count = 0
  let r = n
  while (r !== 0) {
    r = r & (r - 1)
    count++
  }
  return count
}

export const randomInt = (min = 1, max = 100) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const randomFloat = (min = 0, max = 99) =>
  Math.random() * (max - min) + min

export const roundTo = (val: number, decimals = 2) => {
  const mult = 10 ** decimals
  return Math.round((val + Number.EPSILON) * mult) / mult
}
