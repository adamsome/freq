// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/utils/src/dom.ts

import { isStringOrNumber } from './assertion'

type CxParam =
  | string
  | number
  | (Record<string | number, any> & { toString?: () => string })

export const cx = (...classNames: (CxParam | CxParam[])[]): string => {
  const classStrings = classNames.reduce((acc: (string | number)[], c) => {
    if (c) {
      if (isStringOrNumber(c)) {
        acc.push(c)
      } else if (Array.isArray(c)) {
        if (c.length) {
          const cs = cx(c)
          if (cs) {
            acc.push(cs)
          }
        }
      } else if (typeof c === 'object') {
        if (c.toString !== Object.prototype.toString) {
          acc.push(c.toString())
        } else {
          for (const prop in c) {
            if ({}.hasOwnProperty.call(c, prop) && c[prop]) {
              acc.push(prop)
            }
          }
        }
      }
    }
    return acc
  }, []) as (string | number)[]

  return classStrings.join(' ')
}

export function canUseDom() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
}

export const isBrowser = canUseDom()

export const isLeftClick = (e: any) =>
  typeof e.button !== 'number' || e.button === 0
