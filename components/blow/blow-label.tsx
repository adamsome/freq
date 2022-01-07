/* eslint-disable react/display-name */
import type { HTMLAttributes } from 'react'
import { BlowToken } from '../../lib/types/blow.types'
import BlowCoin, { BlowCoinProps } from './blow-coin'

type Props = HTMLAttributes<HTMLSpanElement> & {
  label?: string | (string | BlowToken)[]
  coinProps?: Partial<BlowCoinProps>
}

const isString = (p: unknown): p is string => typeof p === 'string'

const createPartRenderer =
  (coinProps: Partial<BlowCoinProps> = {}) =>
  (p: string | BlowToken, i: number, arr: (string | BlowToken)[]) => {
    if (!isString(p)) {
      switch (p.type) {
        case 'coin': {
          return (
            <BlowCoin key={i} className="mt-0.5" {...coinProps}>
              {p.value}
            </BlowCoin>
          )
        }
        default:
        case 'card': {
          return <span key={i}>{p.value}</span>
        }
      }
    }

    let label = p
    if (i > 0 && !isString(arr[i - 1])) {
      label = ' ' + label
    }
    if (i < arr.length - 1) {
      label = label + ' '
    }
    return <span key={i}>{label}</span>
  }

export default function BlowLabel({ label = '', coinProps, ...props }: Props) {
  const parts = Array.isArray(label) ? label : [label]
  const renderPart = createPartRenderer(coinProps)
  return <span {...props}>{parts.map(renderPart)}</span>
}
