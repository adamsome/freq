import React from 'react'
import { getTeamColor } from '../../lib/color-dict'
import { getTeamName } from '../../lib/game'
import { getTeamIcon } from '../../lib/icon'
import { range } from '../../util/array'
import { cx } from '../../util/dom'
import { styleColor } from '../../util/dom-style'
import SkeletonBox from '../skeleton-box'

type Props = typeof defaultProps & {
  winner?: 1 | 2
  turn?: 1 | 2
}

const defaultProps = {}

export default function CodeGridStatus({ winner, turn }: Props) {
  if (!winner && !turn)
    return <SkeletonBox className="w-full h-8 px-0 sm:px-4" />

  const team = winner ?? turn
  const color = getTeamColor(team)
  const name = getTeamName(team)
  const icon = getTeamIcon(team)
  const text = winner ? `${name} team wins!` : `${name} is guessing...`

  return (
    <div
      className={cx(
        'bg-gray-100 dark:bg-gray-950',
        'text-lg font-mono font-bold',
        'w-full px-2 sm:px-4 py-1',
        { 'text-center': winner }
      )}
      style={styleColor(color, winner ? 1 : 0)}
    >
      {winner && range(0, 3).map((_, i) => <span key={i}>{icon}</span>)}
      <span className={cx({ 'mx-2': winner })}>{text}</span>
      {winner && range(0, 3).map((_, i) => <span key={i}>{icon}</span>)}
    </div>
  )
}

CodeGridStatus.defaultProps = defaultProps
