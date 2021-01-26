import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { getPlayersPerTeam } from '../lib/player'
import { GameView, Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import PlayerCard from './player-card'

type Props = typeof defaultProps & {
  game: GameView
}

const defaultProps = {}

const Scoreboard = ({ game }: Props) => {
  // Modal state
  // TODO: Only make modal openable by a captain
  // TODO: Only make players clickable by a captain
  const [modelOpen, setModelOpen] = useState<Player | null>(null)
  const handlePlayerSelect = (p: Player) => setModelOpen(p)
  const handleModalClose = () => setModelOpen(null)

  const { currentPlayer, score_team_1, score_team_2 } = game
  const teams = getPlayersPerTeam(game.players)
  // TODO: Add to game view state
  const activePlayers: string[] = []

  return (
    <div className="wrapper">
      <div className="header">
        <div className="icon">🔥</div>
        <div className="name">Red</div>
        <div className="score">
          {score_team_1} &mdash; {score_team_2}
        </div>
        <div className="name right">Blue</div>
        <div className="icon right">🌊</div>
      </div>

      <div className="grid">
        {teams.map((t, i) => (
          <div key={i} className={cx('column', i === 1 && 'right')}>
            {t.map((p) => (
              <div
                key={p.id}
                className={cx(
                  'player',
                  activePlayers.includes(p.id) && 'selected'
                )}
                style={styleColor(p, activePlayers.includes(p.id))}
                onClick={() => handlePlayerSelect(p)}
              >
                <div className="icon">{p.icon}</div>

                <div className="name-wrapper">
                  <div
                    className={cx({
                      name: true,
                      current: currentPlayer.id === p.id,
                    })}
                  >{`${p.name ?? 'Unnamed'}`}</div>
                  {p.leader && <div>🎩</div>}
                  {game.psychic === p.id && <div>🧠</div>}
                </div>

                <div className="score">{p.score ?? 0}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal
        open={modelOpen != null}
        onClose={handleModalClose}
        center
        classNames={{ modal: 'freq-model-reset-sm' }}
      >
        <PlayerCard player={modelOpen} game={game} onClose={handleModalClose} />
      </Modal>

      <style jsx>{`
        .wrapper {
          width: 100%;
          padding: 0 6px;
          white-space: nowrap;
          overflow: hidden;
        }

        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-weight: 800;
          border-bottom: 1px solid var(--border-3);
          padding: 0 0;
          white-space: nowrap;
        }

        .header > div {
          flex: 0 0 auto;
        }

        .header > .name {
          width: 5em;
          white-space: nowrap;
        }

        .header > .name.right {
          text-align: right;
        }

        .header > .score {
          flex: 1;
          text-align: center;
          font-size: var(--font-size-lg);
        }

        .score {
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: 50% 50%;
          width: 100%;
        }

        .column {
          padding-top: 3px;
        }

        .column:not(:last-of-type) {
          border-right: 1px solid var(--border-3);
        }

        .player {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          color: var(--body);
          padding-top: var(--stack-xs);
          padding-bottom: var(--stack-xs) 0.87em;
          padding-left: 0em;
          padding-right: 0.87em;
          margin-right: 3px;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
        }

        .column.right .player {
          margin-right: 0;
          margin-left: 3px;
          padding-left: 0.87em;
          padding-right: 0;
          flex-direction: row-reverse;
        }

        .player:hover {
          background: var(--bg-1);
        }

        .player > * {
          text-align: center;
        }

        .player .icon,
        .header .icon {
          flex: 0 0 1.5em;
          margin-left: var(--inset-xs);
          margin-right: var(--inset-xs);
          text-align: center;
        }

        .icon.right {
          margin-right: var(--inset-xs);
        }

        .player .name-wrapper {
          flex: 1;
          display: flex;
        }

        .player .name.current {
          font-weight: 600;
        }

        .player .name-wrapper > * {
          text-align: left;
          margin-right: var(--inset-xs);
          white-space: nowrap;
          overflow: hidden;
        }

        .column.right .name-wrapper {
          flex-direction: row-reverse;
        }

        .column.right .name {
          text-align: right;
          margin-right: 0;
          margin-left: var(--inset-xs);
        }

        @media screen and (max-width: 480px) {
          .header .icon,
          .player {
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </div>
  )
}

Scoreboard.defaultProps = defaultProps

export default Scoreboard
