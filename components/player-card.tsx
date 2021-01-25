import React from 'react'
import { getTeamName } from '../lib/game'
import { Player } from '../types/player.types'
import { colorPlayer } from '../util/dom-style'
import { postJson } from '../util/fetch-json'

type Props = typeof defaultProps & {
  player?: Player | null
  psychic?: string
  onClose?: () => void
}

const defaultProps = {}

const PlayerCard = ({ player, psychic, onClose }: Props) => {
  if (!player) return null

  const teamName = getTeamName(player.team)

  const handlePsychicChange = (psychic: string) => async (
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    await postJson('/api/psychic', { psychic })
    if (onClose) onClose()
  }

  return (
    <>
      <h2 style={colorPlayer(player, true)}>{player.name}</h2>
      <div>
        {psychic !== player.id && (
          <button
            style={colorPlayer(player)}
            onClick={handlePsychicChange(player.id)}
          >
            Make {teamName} Psychic
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
