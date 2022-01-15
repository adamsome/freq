/* eslint-disable react/display-name */
import type { HTMLAttributes } from 'react'
import { BlowToken } from '../../lib/types/blow.types'
import BlowCoin, { BlowCoinProps } from './blow-coin'
import BlowPlayerLabel from './blow-player-label'
import BlowRoleLabel from './blow-role-label'

export type BlowLabelItem = string | BlowToken

type Props = HTMLAttributes<HTMLSpanElement> & {
  className?: string
  label?: string | BlowLabelItem[]
  coinProps?: Partial<BlowCoinProps>
}

const isString = (p: unknown): p is string => typeof p === 'string'

const createPartRenderer =
  ({ coinProps }: Props) =>
  (
    p: string | BlowToken,
    i: number,
    arr: (string | BlowToken)[]
  ): JSX.Element => {
    if (!isString(p)) {
      switch (p.type) {
        case 'coin': {
          return (
            <BlowCoin key={i} className="mt-0.5" {...coinProps}>
              {p.value}
            </BlowCoin>
          )
        }
        case 'card': {
          return <span key={i}>{p.value}</span>
        }
        case 'player': {
          return <BlowPlayerLabel key={i} value={p.value} />
        }
        case 'role': {
          return <BlowRoleLabel key={i} value={p.value} />
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

export default function BlowLabel(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className, label = '', coinProps, ...spanProps } = props
  const parts = Array.isArray(label) ? label : [label]
  const renderPart = createPartRenderer(props)
  return (
    <span className={className} {...spanProps}>
      {parts.map(renderPart)}
    </span>
  )
}
