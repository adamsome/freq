import React from 'react'
import useGame from '../hooks/use-game'
import { getTeamName } from '../lib/game'
import { getTeamIcon } from '../lib/icon'
import { cx } from '../util/dom'
import ScoreboardIcon from './scoreboard-icon'

type Props = typeof defaultProps

const defaultProps = {}

export default function ScoreboardHeader(_: Props) {
  const { game } = useGame()
  if (!game) return null

  const { score_team_1, score_team_2 } = game

  const icon1 = getTeamIcon(1)
  const icon2 = getTeamIcon(2)
  const team1 = getTeamName(1)
  const team2 = getTeamName(2)

  return (
    <div
      className={cx(
        'flex justify-between items-baseline w-full px-2',
        'font-black border-b border-black dark:border-white',
        'text-2xl whitespace-nowrap'
      )}
    >
      <ScoreboardIcon xl>{icon1}</ScoreboardIcon>
      <div className="w-20 whitespace-nowrap">{team1}</div>
      <div className="flex-1 text-center text-3xl">
        {score_team_1} &mdash; {score_team_2}
      </div>
      <div className="w-20 whitespace-nowrap text-right">{team2}</div>
      <ScoreboardIcon xl right>
        {icon2}
      </ScoreboardIcon>
    </div>
  )
}

ScoreboardHeader.defaultProps = defaultProps
