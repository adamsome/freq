/* eslint-disable react/display-name */
import type { HTMLAttributes } from 'react'
import { BlowActionButtonColor, BlowToken } from '../../lib/types/blow.types'
import BlowCoin from './blow-coin'

type Props = HTMLAttributes<HTMLSpanElement> & {
  label?: string | (string | BlowToken)[]
  color?: BlowActionButtonColor
}

const isString = (p: unknown): p is string => typeof p === 'string'

const createPartRenderer =
  (color?: BlowActionButtonColor) =>
  (p: string | BlowToken, i: number, arr: (string | BlowToken)[]) => {
    if (!isString(p)) {
      switch (p.type) {
        case 'coin': {
          return (
            <BlowCoin key={i} color={color}>
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

export default function BlowLabel({ label = '', color, ...props }: Props) {
  const parts = Array.isArray(label) ? label : [label]
  const renderPart = createPartRenderer(color)
  return <span {...props}>{parts.map(renderPart)}</span>
}
