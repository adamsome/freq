import React from 'react'
import { getPlayersPerTeam } from '../lib/player'
import { PlayerView, ScoreType } from '../types/game.types'
import { cx } from '../util/dom'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'
import ScoreboardPlayerRow from './scoreboard-player-row'
import ScoreboardPlayerScore from './scoreboard-player-score'

type Props = typeof defaultProps & {
  currentPlayer?: PlayerView
  players?: PlayerView[]
  scoreType: ScoreType
  onPlayerClick: (player: PlayerView) => void
}

const defaultProps = {
  readonly: false,
}

export default function ScoreboardGrid({
  currentPlayer,
  players,
  scoreType,
  readonly,
  onPlayerClick,
}: Props) {
  if (!players) return null

  const teams = getPlayersPerTeam(players)

  const Player = (right = false) => (player: PlayerView) => {
    const score = (scoreType === 'points' ? player.points : player.wins) ?? 0
    return (
      <ScoreboardPlayerRow
        key={player.id}
        player={player}
        right={right}
        active={player.active}
        current={player.current}
        leader={currentPlayer?.leader}
        readonly={readonly}
        onClick={() => currentPlayer?.leader && onPlayerClick(player)}
      >
        <ScoreboardIcon right={right}>{player.icon}</ScoreboardIcon>
        <ScoreboardPlayerName
          player={player}
          right={right}
          psychic={player.showPsychic}
          nextPsychic={player.showNextPsychic}
        />
        <ScoreboardPlayerScore score={score} />
      </ScoreboardPlayerRow>
    )
  }

  const Team = (team: PlayerView[], i: number) => (
    <div
      key={i}
      className={cx('pt-1', {
        'border-r border-black dark:border-white last:border-r-0': !readonly,
      })}
    >
      {team.map(Player(i === 1))}
    </div>
  )

  return <div className="grid grid-cols-2 w-full">{teams.map(Team)}</div>
}

ScoreboardGrid.defaultProps = defaultProps
