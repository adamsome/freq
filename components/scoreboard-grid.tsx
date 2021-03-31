import React from 'react'
import { getPlayersPerTeam } from '../lib/player'
import { PlayerView, ScoreType } from '../types/game.types'
import { range } from '../util/array'
import { cx } from '../util/dom'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'
import ScoreboardPlayerRow from './scoreboard-player-row'
import ScoreboardPlayerScore from './scoreboard-player-score'
import SkeletonBox from './skeleton-box'

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
  const teams = players
    ? getPlayersPerTeam(players)
    : // Build skeleton until players load
      [range(0, 3).map(() => undefined), range(0, 3).map(() => undefined)]

  const Player = (right = false) => (
    player: PlayerView | undefined,
    i: number
  ) => {
    if (!player)
      return <SkeletonBox key={i} className="w-full h-8 mb-2" rounded={false} />

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

  const Team = (team: (PlayerView | undefined)[], i: number) => (
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
