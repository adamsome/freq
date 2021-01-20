// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/utils/src/function.ts

import { isFunction, __DEV__ } from './assertion'

export const noop = () => {}

export function once(fn?: Function | null) {
  let result: any

  return function func(this: any, ...args: any[]) {
    if (fn) {
      result = fn.apply(this, args)
      fn = null
    }

    return result
  }
}

export function runIfFn<T, U>(
  valueOrFn: T | ((...fnArgs: U[]) => T),
  ...args: U[]
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn
}

type MessageOptions = {
  condition: boolean
  message: string
}

export const warn = once((options: MessageOptions) => {
  const { condition, message } = options
  if (condition && __DEV__) {
    console.warn(message)
  }
})

export const error = once((options: MessageOptions) => {
  const { condition, message } = options
  if (condition && __DEV__) {
    console.error(message)
  }
})
