import React from 'react'

type Props = typeof defaultProps & {
  score: number
}

const defaultProps = {}

export default function ScoreboardPlayerScore({ score }: Props) {
  return <div className="font-semibold text-center">{score}</div>
}

ScoreboardPlayerScore.defaultProps = defaultProps
