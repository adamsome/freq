/* eslint-disable react/display-name */
import type { HTMLAttributes } from 'react'
import { BlowLabelItem, BlowToken } from '../../lib/types/blow.types'
import BlowCoin, { BlowCoinProps } from './blow-coin'
import BlowPlayerLabel from './blow-player-label'
import BlowRoleLabel from './blow-role-label'

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
    if (isString(p)) {
      p = { type: 'text', value: p }
    }

    switch (p.type) {
      case 'coin': {
        return (
          <BlowCoin key={i} className={p.className ?? 'mt-0.5'} {...coinProps}>
            {p.value}
          </BlowCoin>
        )
      }
      case 'card': {
        return (
          <span className={p.className} key={i}>
            {p.value}
          </span>
        )
      }
      case 'player': {
        return (
          <BlowPlayerLabel className={p.className} key={i} value={p.value} />
        )
      }
      case 'role': {
        return <BlowRoleLabel className={p.className} key={i} value={p.value} />
      }
      case 'text': {
        let text = p.value
        if (i > 0 && !isString(arr[i - 1])) {
          text = ' ' + text
        }
        if (i < arr.length - 1) {
          text = text + ' '
        }
        return (
          <span className={p.className} key={i}>
            {text}
          </span>
        )
      }
    }
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
