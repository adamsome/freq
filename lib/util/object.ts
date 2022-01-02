/*! chakra-ui v1.2.3 | MIT License | https://github.com/chakra-ui/chakra-ui/blob/develop/packages/utils/src/object.ts */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj != null
}

interface OmitFn {
  <T, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2]
  }
}

export const omit: OmitFn = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: typeof obj[K]
  }
  let key: keyof typeof obj
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key]
    }
  }
  return ret
}

export const objectKeys = <T>(obj: T): (keyof T)[] =>
  Object.keys(obj) as unknown as (keyof T)[]

export function toIDMap<T, TKey extends string | number | symbol = string>(
  arr: T[] | undefined | null,
  idAccessor?: (it: T) => TKey
): Record<TKey, T> {
  const keyFn =
    idAccessor ??
    ((it: T) => ((it as Record<string, unknown>).id ?? String(it)) as TKey)
  return (arr ?? []).reduce((acc, it) => {
    acc[keyFn(it)] = it
    return acc
  }, {} as Record<TKey, T>)
}

export function toTruthMap<T, TKey extends string | number | symbol = string>(
  arr: T[] | undefined | null,
  keyAccessor?: (it: T) => TKey
): Record<TKey, boolean> {
  const keyFn = keyAccessor ?? ((it: T) => String(it) as TKey)
  return (arr ?? []).reduce((acc, it) => {
    acc[keyFn(it)] = true
    return acc
  }, {} as Record<TKey, boolean>)
}
