import React from 'react'
import { getNextPsychic } from '../lib/game'
import { isFreePhase } from '../lib/phase'
import { getPlayersPerTeam } from '../lib/player'
import { calculatePlayerPoints } from '../lib/player-stats'
import { GameView, Player, ScoreType } from '../types/game.types'
import { cx } from '../util/dom'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'
import ScoreboardPlayerRow from './scoreboard-player-row'
import ScoreboardPlayerScore from './scoreboard-player-score'

type Props = typeof defaultProps & {
  game?: GameView
  scoreType: ScoreType
  onPlayerClick: (player: Player) => void
}

const defaultProps = {
  readonly: false,
}

export default function ScoreboardGrid({
  game,
  scoreType,
  readonly,
  onPlayerClick,
}: Props) {
  if (!game) return null

  const { currentPlayer, activePlayers } = game

  const leader = currentPlayer?.leader == true
  const teams = getPlayersPerTeam(game.players)
  const nextPsychic = getNextPsychic(game)
  const showPsychic = game.phase !== 'prep'
  const showNextPsychic = isFreePhase(game.phase) || game.next_psychic != null

  const Player = (right = false) => (player: Player) => {
    const isNextPsychic = nextPsychic?.id === player.id
    const stats = game.stats?.[player.id]
    const score =
      scoreType === 'points' ? calculatePlayerPoints(stats) : stats?.w ?? 0
    return (
      <ScoreboardPlayerRow
        key={player.id}
        player={player}
        right={right}
        active={activePlayers.includes(player.id)}
        current={currentPlayer?.id === player.id}
        leader={leader}
        readonly={readonly}
        onClick={() => leader && onPlayerClick(player)}
      >
        <ScoreboardIcon right={right}>{player.icon}</ScoreboardIcon>
        <ScoreboardPlayerName
          player={player}
          right={right}
          psychic={showPsychic && !isNextPsychic && game.psychic === player.id}
          nextPsychic={showNextPsychic && isNextPsychic}
        />
        <ScoreboardPlayerScore score={score} />
      </ScoreboardPlayerRow>
    )
  }

  const Team = (team: Player[], i: number) => (
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
