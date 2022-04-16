/* eslint-disable react/display-name */
import type { HTMLAttributes } from 'react'
import {
  BlowLabelDef,
  BlowPlayerView,
  BlowThemeID,
  BlowToken,
} from '../../../lib/types/blow.types'
import { cx } from '../../../lib/util/dom'
import BlowCoin, { BlowCoinProps } from './blow-coin'
import BlowPlayerLabel from './blow-player-label'
import BlowRoleActionLabel from './blow-role-action-label'
import BlowRoleLabel from './blow-role-label'

type Props = HTMLAttributes<HTMLSpanElement> & {
  className?: string
  label?: BlowLabelDef
  theme: BlowThemeID
  players?: BlowPlayerView[]
  coinProps?: Partial<BlowCoinProps>
}

const isString = (p: unknown): p is string => typeof p === 'string'

export default function BlowLabel(props: Props) {
  const { className, label = '', theme, ...spanProps } = props
  delete spanProps.coinProps
  const parts = Array.isArray(label) ? label : [label]
  return (
    <span className={cx('whitespace-normal', className)} {...spanProps}>
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
        <BlowCoin
          className={p.className ?? 'mt-0.5'}
          {...coinProps}
          showIndividualCoins={p.showIndividualCoins}
        >
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
        <BlowRoleLabel
          className={p.className}
          theme={theme}
          value={p.value}
          border={p.border}
        />
      )
    }
    case 'action': {
      return (
        <BlowRoleActionLabel
          className={p.className}
          theme={theme}
          value={p.value}
          role={p.role}
          border={p.border}
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
