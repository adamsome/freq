import React, { useState } from 'react'
import { CwdSettings } from '../types/cwd.types'
import { GameType, PlayerView, ScoreType } from '../types/game.types'
import { cx } from '../util/dom'
import ActionModal from './action-modal'
import PlayerCard from './player-card'
import ScoreboardGrid from './scoreboard-grid'
import ScoreboardHeader from './scoreboard-header'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'
import ScoreboardPlayerRow from './scoreboard-player-row'
import ScoreboardSettings from './scoreboard-settings'

interface HasScoreboardProps {
  type: GameType
  settings?: CwdSettings
  currentPlayer?: PlayerView
  score_team_1?: number
  score_team_2?: number
  players: PlayerView[]
}

type Props = typeof defaultProps & {
  game?: HasScoreboardProps
}

const defaultProps = {
  readonly: false,
}

export default function Scoreboard({ game, readonly }: Props) {
  const [playerOpen, setPlayerOpen] = useState<PlayerView | null>(null)
  const [scoreType, setScoreType] = useState<ScoreType>('wins')

  const handleModalClose = () => setPlayerOpen(null)

  const scores = [game?.score_team_1 ?? 0, game?.score_team_2 ?? 0] as const
  const designatedPsychic = game?.players.find((p) => p.designatedPsychic)

  return (
    <div className={cx('w-full whitespace-nowrap', { 'mb-6': !readonly })}>
      {designatedPsychic && (
        <div className="flex flex-center w-full mb-2">
          <span className="pl-2 pr-3 py-0.5 rounded font-semibold text-base bg-gray-900 text-gray-500">
            👁 &nbsp;Designated Psychic&nbsp;👁
          </span>
          <ScoreboardPlayerRow
            player={designatedPsychic}
            leader={true}
            readonly={true}
          >
            <ScoreboardIcon>{designatedPsychic.icon}</ScoreboardIcon>
            <ScoreboardPlayerName
              type={game?.type}
              player={designatedPsychic}
            />
          </ScoreboardPlayerRow>
        </div>
      )}

      {!readonly && <ScoreboardHeader scores={scores} readonly={readonly} />}

      <ScoreboardGrid
        type={game?.type}
        currentPlayer={game?.currentPlayer}
        players={game?.players}
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
