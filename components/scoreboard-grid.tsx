import React from 'react'
import useGame from '../hooks/use-game'
import { getNextPsychic } from '../lib/game'
import { isFreePhase } from '../lib/phase'
import { getPlayersPerTeam } from '../lib/player'
import { Player, ScoreType } from '../types/game.types'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'
import ScoreboardPlayerRow from './scoreboard-player-row'
import ScoreboardPlayerScore from './scoreboard-player-score'

type Props = typeof defaultProps & {
  scoreType: ScoreType
  onPlayerClick: (player: Player) => void
}

const defaultProps = {}

export default function ScoreboardGrid({ scoreType, onPlayerClick }: Props) {
  const { game } = useGame()
  if (!game) return null

  const { currentPlayer, activePlayers } = game

  const leader = currentPlayer?.leader == true
  const teams = getPlayersPerTeam(game.players)
  const nextPsychic = getNextPsychic(game)
  const showPsychic = game.phase !== 'prep'
  const showNextPsychic = isFreePhase(game.phase) || game.next_psychic != null

  const Player = (right = false) => (player: Player) => {
    const isNextPsychic = nextPsychic?.id === player.id
    return (
      <ScoreboardPlayerRow
        key={player.id}
        player={player}
        right={right}
        active={activePlayers.includes(player.id)}
        current={currentPlayer?.id === player.id}
        leader={leader}
        onClick={() => leader && onPlayerClick(player)}
      >
        <ScoreboardIcon right={right}>{player.icon}</ScoreboardIcon>
        <ScoreboardPlayerName
          player={player}
          right={right}
          psychic={showPsychic && !isNextPsychic && game.psychic === player.id}
          nextPsychic={showNextPsychic && isNextPsychic}
        />
        <ScoreboardPlayerScore scoreType={scoreType} player={player} />
      </ScoreboardPlayerRow>
    )
  }

  const Team = (team: Player[], i: number) => (
    <div
      key={i}
      className="pt-1 border-r border-black dark:border-white last:border-r-0"
    >
      {team.map(Player(i === 1))}
    </div>
  )

  return <div className="grid grid-cols-2 w-full">{teams.map(Team)}</div>
}

ScoreboardGrid.defaultProps = defaultProps
