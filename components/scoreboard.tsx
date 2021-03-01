import React, { useState } from 'react'
import { Player, ScoreType } from '../types/game.types'
import ActionModal from './action-modal'
import PlayerCard from './player-card'
import ScoreboardGrid from './scoreboard-grid'
import ScoreboardHeader from './scoreboard-header'
import ScoreboardSettings from './scoreboard-settings'

type Props = typeof defaultProps

const defaultProps = {}

const Scoreboard = (_: Props) => {
  const [playerOpen, setPlayerOpen] = useState<Player | null>(null)
  const [scoreType, setScoreType] = useState<ScoreType>('wins')

  const handleModalClose = () => setPlayerOpen(null)

  return (
    <div className="w-full whitespace-nowrap mb-6">
      <ScoreboardHeader />
      <ScoreboardGrid scoreType={scoreType} onPlayerClick={setPlayerOpen} />
      <ScoreboardSettings scoreType={scoreType} onTypeToggle={setScoreType} />

      <ActionModal open={playerOpen != null} onClose={handleModalClose}>
        <PlayerCard player={playerOpen} onClose={handleModalClose} />
      </ActionModal>
    </div>
  )
}

Scoreboard.defaultProps = defaultProps

export default Scoreboard
