// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/utils/src/object.ts

import { Dict, StringOrNumber } from '../types/object.model'

interface OmitFn {
  <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
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

export function pick<T extends Dict, K extends keyof T>(object: T, keys: K[]) {
  const result = {} as { [P in K]: T[P] }

  keys.forEach((key) => {
    if (key in object) {
      result[key] = object[key]
    }
  })

  return result
}

export function split<T extends Dict, K extends keyof T>(object: T, keys: K[]) {
  const picked: Dict = {}
  const omitted: Dict = {}

  Object.keys(object).forEach((key) => {
    if (keys.includes(key as T[K])) {
      picked[key] = object[key]
    } else {
      omitted[key] = object[key]
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

    const value = fn(obj, path, fallback, index)

    map.set(path, value)

    return value
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

type FilterFn<T> = (value: any, key: string, object: T) => boolean

/**
 * Returns the items of an object that meet the condition specified in a callback function.
 *
 * @param object the object to loop through
 * @param fn The filter function
 */
export function objectFilter<T extends Dict>(object: T, fn: FilterFn<T>) {
  const result: Dict = {}

  Object.keys(object).forEach((key) => {
    const value = object[key]
    const shouldPass = fn(value, key, object)
    if (shouldPass) {
      result[key] = value
    }
  })

  return result
}

export const filterUndefined = (object: Dict) =>
  objectFilter(object, (val) => val !== null && val !== undefined)

export const objectKeys = <T extends Dict>(obj: T) =>
  (Object.keys(obj) as unknown) as (keyof T)[]
