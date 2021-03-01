import React from 'react'
import { Player, ScoreType } from '../types/game.types'
import { roundTo } from '../util/number'

type Props = typeof defaultProps & {
  scoreType: ScoreType
  player: Player
}

const defaultProps = {}

export default function ScoreboardPlayerScore({ scoreType, player }: Props) {
  const score =
    scoreType === 'points' ? roundTo(player.score ?? 0) : player.wins

  return <div className="font-semibold text-center">{score}</div>
}

ScoreboardPlayerScore.defaultProps = defaultProps
