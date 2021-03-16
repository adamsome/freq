import React, { useState } from 'react'
import { GameView, Player, ScoreType } from '../types/game.types'
import { cx } from '../util/dom'
import ActionModal from './action-modal'
import PlayerCard from './player-card'
import ScoreboardGrid from './scoreboard-grid'
import ScoreboardHeader from './scoreboard-header'
import ScoreboardSettings from './scoreboard-settings'

type Props = typeof defaultProps & {
  game?: GameView
}

const defaultProps = {
  readonly: false,
}

export default function Scoreboard({ game, readonly }: Props) {
  const [playerOpen, setPlayerOpen] = useState<Player | null>(null)
  const [scoreType, setScoreType] = useState<ScoreType>('wins')

  const handleModalClose = () => setPlayerOpen(null)

  return (
    <div className={cx('w-full whitespace-nowrap', { 'mb-6': !readonly })}>
      {!readonly && <ScoreboardHeader game={game} readonly={readonly} />}

      <ScoreboardGrid
        game={game}
        scoreType={scoreType}
        readonly={readonly}
        onPlayerClick={setPlayerOpen}
      />

      {!readonly && (
        <ScoreboardSettings scoreType={scoreType} onTypeToggle={setScoreType} />
      )}

      {!readonly && (
        <ActionModal open={playerOpen != null} onClose={handleModalClose}>
          <PlayerCard player={playerOpen} onClose={handleModalClose} />
        </ActionModal>
      )}
    </div>
  )
}

Scoreboard.defaultProps = defaultProps
