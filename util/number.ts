export const randomInt = (min = 1, max = 100) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const randomFloat = (min = 0, max = 99) =>
  Math.random() * (max - min) + min
