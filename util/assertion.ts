// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/utils/src/assertion.ts

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export const isNil = (value: any): value is null | undefined => value == null

export function isNumeric(value: any) {
  return value != null && value - parseFloat(value) + 1 >= 0
}

export function isStringOrNumber(value: any): value is string | number {
  const type = typeof value
  return type === 'string' || type === 'number'
}

export const __DEV__ = process.env.NODE_ENV !== 'production'
