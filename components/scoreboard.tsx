import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { getNextPsychic, getTeamName } from '../lib/game'
import { getTeamIcon } from '../lib/icon'
import { isFreePhase } from '../lib/phase'
import { getPlayersPerTeam } from '../lib/player'
import { GameView, Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { roundTo } from '../util/number'
import PlayerCard from './player-card'

type Props = typeof defaultProps & {
  game: GameView
}

const defaultProps = {}

const Scoreboard = ({ game }: Props) => {
  // Modal state
  const [modelOpen, setModelOpen] = useState<Player | null>(null)
  const [showScore, setShowScore] = useState(false)

  const { currentPlayer, score_team_1, score_team_2, activePlayers } = game
  if (!currentPlayer) return null

  const leader = currentPlayer.leader == true
  const teams = getPlayersPerTeam(game.players)
  const nextPsychic = getNextPsychic(game)
  const showNextPsychic = isFreePhase(game.phase) || game.next_psychic != null
  const icon1 = getTeamIcon(1)
  const icon2 = getTeamIcon(2)
  const team1 = getTeamName(1)
  const team2 = getTeamName(2)

  const handlePlayerSelect = (p: Player) => leader && setModelOpen(p)
  const handleModalClose = () => setModelOpen(null)

  return (
    <div className={cx({ wrapper: true, leader })}>
      <div className="header">
        <div className="icon">{icon1}</div>
        <div className="name">{team1}</div>
        <div className="score">
          {score_team_1} &mdash; {score_team_2}
        </div>
        <div className="name right">{team2}</div>
        <div className="icon right">{icon2}</div>
      </div>

      <div className="grid">
        {teams.map((t, i) => (
          <div key={i} className={cx('column', i === 1 && 'right')}>
            {t.map((player) => (
              <div
                key={player.id}
                className="player"
                style={styleColor(
                  player.color,
                  activePlayers.includes(player.id)
                    ? 1
                    : currentPlayer.id === player.id
                    ? 0.25
                    : 0
                )}
                onClick={() => handlePlayerSelect(player)}
              >
                <div className="icon">{player.icon}</div>

                <div className="name-wrapper">
                  <div
                    className={cx({
                      name: true,
                      leader: player.leader,
                    })}
                  >{`${player.name ?? 'Unnamed'}`}</div>
                  {game.phase !== 'prep' &&
                    game.psychic === player.id &&
                    nextPsychic?.id !== player.id && <div>🧠</div>}
                  {nextPsychic?.id === player.id && showNextPsychic && (
                    <div className="xs">🧠</div>
                  )}
                </div>

                <div className="score">
                  {showScore ? roundTo(player.score ?? 0) : player.wins}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={() => setShowScore(!showScore)}>
        Show {showScore ? 'Scores' : 'Wins'}
      </button>

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
          padding: 0;
          white-space: nowrap;
        }

        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-weight: 900;
          border-bottom: 1px solid var(--border-3);
          padding: 0 var(--inset-sm);
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
          font-weight: 900;
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
          padding-left: var(--inset-sm);
          padding-right: 0.67em;
          margin-right: 3px;
          white-space: nowrap;
          overflow: hidden;
        }

        .leader .player {
          cursor: pointer;
        }

        .column.right .player {
          margin-right: 0;
          margin-left: 3px;
          padding-left: 0.67em;
          padding-right: var(--inset-sm);
          flex-direction: row-reverse;
        }

        .leader .player:hover {
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
          align-self: center;
        }

        .icon.right {
          margin-right: var(--inset-xs);
        }

        .player .name-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .player .name.leader {
          font-weight: 600;
        }

        .player .name-wrapper > * {
          text-align: left;
          margin-right: var(--inset-xs);
          white-space: nowrap;
        }

        .player .name-wrapper > .name {
          flex: 0 1 auto;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .column.right .name-wrapper {
          flex-direction: row-reverse;
        }

        .column.right .name {
          text-align: right;
          margin-right: 0;
          margin-left: var(--inset-xs);
        }

        .xs {
          font-size: var(--font-size-xs);
        }

        button {
          width: 100%;
          margin-top: var(--stack-md);
        }

        @media screen and (max-width: 480px) {
          button,
          .header .icon,
          .player {
            font-size: var(--font-size-sm);
          }

          .icon.right,
          .player .icon,
          .header .icon {
            margin-left: 0;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  )
}

Scoreboard.defaultProps = defaultProps

export default Scoreboard
