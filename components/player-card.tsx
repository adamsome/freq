import React from 'react'
import {
  getNextPsychic,
  getTeamName,
  isInvalidPlayerTeamChange,
} from '../lib/game'
import { CommandType, GameView, Player } from '../types/game.types'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'

type Props = typeof defaultProps & {
  player?: Player | null
  game: GameView
  onClose?: () => void
}

const defaultProps = {}

const PlayerCard = ({ player, game, onClose }: Props) => {
  if (!player) return null

  const { psychic, canChangePsychicTo } = game
  const teamName = getTeamName(player.team)
  const opposingTeamName = getTeamName(player.team === 1 ? 2 : 1)
  const nextPsychic = getNextPsychic(game)

  const canChangePsychic =
    canChangePsychicTo === 'none'
      ? false
      : canChangePsychicTo === 'any'
      ? true
      : !nextPsychic || player.team === nextPsychic.team

  const canChangeTeam = !isInvalidPlayerTeamChange(game, player)

  const handlePlayerCommand = (type: CommandType) => async (
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    try {
      await postCommand(type, player)
    } catch (err) {
      console.error(`Error posting command '${type}'.`, err.data ?? err)
    }
    if (onClose) onClose()
  }

  return (
    <>
      <h2 style={styleColor(player, true)}>{player.name}</h2>
      <div>
        {canChangeTeam && (
          <button
            style={styleColor(player)}
            onClick={handlePlayerCommand('change_player_team')}
          >
            Move to {opposingTeamName} team
          </button>
        )}

        {psychic !== player.id &&
          nextPsychic?.id !== player.id &&
          canChangePsychic && (
            <button
              style={styleColor(player)}
              onClick={handlePlayerCommand('set_next_psychic')}
            >
              Make next psychic
            </button>
          )}

        {!player.leader && (
          <button
            style={styleColor(player)}
            onClick={handlePlayerCommand('toggle_player_leader')}
          >
            Make {teamName} leader
          </button>
        )}

        <button className="close" onClick={onClose}>
          Close
        </button>
      </div>

      <style jsx>{`
        h2 {
          color: var(--body-light);
          background: var(--translucent);
          margin: 0;
          padding: 0.2em calc(var(--inset-md) + 28px) 0.2em var(--inset-md);
        }

        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          min-width: 16em;
        }

        div > * {
          flex: 0;
          width: 100%;
        }

        button {
          text-align: left;
          padding: var(--stack-sm) var(--inset-md);
          color: var(--body);
          border-radius: 0;
        }

        button:not(:last-child),
        button:focus:not(:last-child) {
          border: 0;
          border-bottom: 1px solid var(--border-1);
        }

        button:hover {
          background: var(--bg-2);
        }

        button.close {
          background: var(--bg-2);
          border: 0;
          color: var(--subtle);
        }

        button.close:hover {
          color: var(--body);
        }
      `}</style>
    </>
  )
}

PlayerCard.defaultProps = defaultProps

export default PlayerCard
