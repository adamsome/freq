/*! chakra-ui v1.2.3 | MIT License | https://github.com/chakra-ui/chakra-ui/blob/develop/packages/utils/src/object.ts */
import { Dict, StringOrNumber } from '../types/object.types'

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

export function pick<T extends Dict, K extends keyof T>(obj: T, keys: K[]) {
  const result = {} as { [P in K]: T[P] }

  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })

  return result
}

export function split<T extends Dict, K extends keyof T>(obj: T, keys: K[]) {
  const picked: Dict = {}
  const omitted: Dict = {}

  Object.keys(obj).forEach((key) => {
    if (keys.includes(key as T[K])) {
      picked[key] = obj[key]
    } else {
      omitted[key] = obj[key]
    }
  })

  return [picked, omitted] as [{ [P in K]: T[P] }, Omit<T, K>]
}

/**
 * Get value from a deeply nested object using a string path.
 * Memoizes the value.
 * @param obj - the object
 * @param path - the string path
 * @param def  - the fallback value
 */
export function get(
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: object,
  path: string | number,
  fallback?: any,
  index?: number
) {
  const key: StringOrNumber[] =
    typeof path === 'string' ? path.split('.') : [path]

  for (index = 0; index < key.length; index += 1) {
    if (!obj) break
    obj = obj[key[index] as keyof typeof obj]
  }

  return obj === undefined ? fallback : obj
}

type Get = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: Readonly<object>,
  path: string | number,
  fallback?: any,
  index?: number
) => any

export const memoize = (fn: Get) => {
  const cache = new WeakMap()

  const memoizedFn: Get = (obj, path, fallback, index) => {
    if (typeof obj === 'undefined') {
      return fn(obj, path, fallback)
    }

    if (!cache.has(obj)) {
      cache.set(obj, new Map())
    }

    const map = cache.get(obj)

    if (map.has(path)) {
      return map.get(path)
    }

    const val = fn(obj, path, fallback, index)

    map.set(path, val)

    return val
  }

  return memoizedFn
}

export const memoizedGet = memoize(get)

/**
 * Get value from deeply nested object, based on path
 * It returns the path value if not found in object
 *
 * @param path - the string path or value
 * @param scale - the string path or value
 */
export function getWithDefault(path: any, scale: any) {
  return memoizedGet(scale, path, path)
}

type FilterFn<T> = (val: any, key: string, obj: T) => boolean

/**
 * Returns the items of an object that meet the condition specified in a callback function.
 *
 * @param obj the object to loop through
 * @param fn The filter function
 */
export function objectFilter<T extends Dict>(obj: T, fn: FilterFn<T>) {
  const result: Dict = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    const shouldPass = fn(value, key, obj)
    if (shouldPass) {
      result[key] = value
    }
  })

  return result
}

export const filterUndefined = (obj: Dict) =>
  objectFilter(obj, (val) => val !== null && val !== undefined)

export const objectKeys = <T extends Dict>(obj: T) =>
  (Object.keys(obj) as unknown) as (keyof T)[]

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

export function toIDMap<T, TKey extends string | number | symbol = string>(
  arr: T[] | undefined | null,
  idAccessor?: (it: T) => TKey
): Record<TKey, T> {
  const keyFn =
    idAccessor ?? ((it: T) => ((it as any).id ?? String(it)) as TKey)
  return (arr ?? []).reduce((acc, it) => {
    acc[keyFn(it)] = it
    return acc
  }, {} as Record<TKey, T>)
}
