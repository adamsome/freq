import React from 'react'
import { PlayerView } from '../types/game.types'
import { cx } from '../util/dom'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'

type Props = typeof defaultProps & {
  player: PlayerView
  label?: string
}

const defaultProps = {}

export default function ScoreboardSpecialPlayer({ player, label }: Props) {
  return (
    <div className="flex flex-col flex-center mb-4">
      <div className="flex flex-center w-full">
        <div
          className={cx(
            'flex justify-between items-center',
            'overflow-hidden whitespace-nowrap',
            'text-base sm:text-lg text-yellow dark:text-yellow-dark'
          )}
        >
          <ScoreboardIcon>{player.icon}</ScoreboardIcon>
          <ScoreboardPlayerName player={player} />
        </div>
      </div>
      <span className="text-xs text-gray-500">{label?.toUpperCase()}</span>
    </div>
  )
}

ScoreboardSpecialPlayer.defaultProps = defaultProps
