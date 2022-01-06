export const toTitleCase = (word: string): string =>
  word.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )

export const isNotEmpty = (...strings: unknown[]): boolean =>
  strings.every((str) => typeof str === 'string' && str.length > 0)

export const isNotNil = (...strings: unknown[]): boolean =>
  strings.every((str) => str != null)
