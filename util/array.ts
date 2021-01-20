export function asArray<T>(arrayOrElement?: T | T[] | null): T[] | undefined {
  if (arrayOrElement != null) {
    return Array.isArray(arrayOrElement) ? arrayOrElement : [arrayOrElement]
  }
}

export function head<T>(arrayOrElement?: T | T[] | null): T | undefined {
  const array = asArray(arrayOrElement)
  return array != null && array.length ? array[0] : undefined
}
