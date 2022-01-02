/*! chakra-ui v1.2.3 | MIT License | https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/utils/src/assertion.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

export const isNil = <T = unknown>(
  value: T | null | undefined
): value is null | undefined => value == null

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isNumeric(value: any): boolean {
  return value != null && value - parseFloat(value) + 1 >= 0
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function isStringOrNumber(value: unknown): value is string | number {
  const type = typeof value
  return type === 'string' || type === 'number'
}

/*! ramda v0.27.1 | MIT License | https://github.com/ramda/ramda/blob/v0.27.0/source/type.js */
/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */
export const type = (
  val: unknown
):
  | 'Object'
  | 'Number'
  | 'Boolean'
  | 'String'
  | 'Null'
  | 'Array'
  | 'RegExp'
  | 'Function'
  | 'Undefined' =>
  val === null
    ? 'Null'
    : val === undefined
    ? 'Undefined'
    : Object.prototype.toString.call(val).slice(8, -1)

export const __DEV__ = process.env.NODE_ENV !== 'production'
