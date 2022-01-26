/* eslint-disable react/display-name */
import type { HTMLAttributes } from 'react'
import {
  BlowLabelItem,
  BlowPlayerView,
  BlowThemeID,
  BlowToken,
} from '../../lib/types/blow.types'
import BlowCoin, { BlowCoinProps } from './blow-coin'
import BlowPlayerLabel from './blow-player-label'
import BlowRoleActionLabel from './blow-role-action-label'
import BlowRoleLabel from './blow-role-label'

type Props = HTMLAttributes<HTMLSpanElement> & {
  className?: string
  label?: BlowLabelItem | BlowLabelItem[]
  theme: BlowThemeID
  players?: BlowPlayerView[]
  coinProps?: Partial<BlowCoinProps>
}

const isString = (p: unknown): p is string => typeof p === 'string'

export default function BlowLabel(props: Props) {
  const { className, label = '', ...spanProps } = props
  delete spanProps.coinProps
  const parts = Array.isArray(label) ? label : [label]
  return (
    <span className={className} {...spanProps}>
      {parts.map((p, i, arr) => (
        <Part key={i} {...props} token={p} index={i} allTokens={arr} />
      ))}
    </span>
  )
}

type PartProps = {
  token: string | BlowToken
  index: number
  allTokens: (string | BlowToken)[]
}

function Part(props: Props & PartProps) {
  const { token, index: i, allTokens, theme, coinProps, players } = props
  let p = token
  if (isString(p)) {
    p = { type: 'text', value: p }
  }

  switch (p.type) {
    case 'coin': {
      return (
        <BlowCoin className={p.className ?? 'mt-0.5'} {...coinProps}>
          {p.value}
        </BlowCoin>
      )
    }
    case 'card': {
      return <span className={p.className}>{p.value}</span>
    }
    case 'player': {
      const value =
        typeof p.value !== 'number' ? p.value : players?.[p.value] ?? 'Unnamed'
      return <BlowPlayerLabel className={p.className} value={value} />
    }
    case 'role': {
      return (
        <BlowRoleLabel className={p.className} value={p.value} theme={theme} />
      )
    }
    case 'action': {
      return (
        <BlowRoleActionLabel
          className={p.className}
          value={p.value}
          role={p.role}
          theme={theme}
        />
      )
    }
    case 'text': {
      let text = p.value
      if (i > 0 && !isString(allTokens[i - 1])) {
        text = ' ' + text
      }
      if (i < allTokens.length - 1) {
        text = text + ' '
      }
      return <span className={p.className}>{text}</span>
    }
  }
}
