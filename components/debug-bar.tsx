import React from 'react'
import { mutate } from 'swr'
import { nextPhase } from '../lib/phase'
import { GameView } from '../types/game.types'
import { User } from '../types/user.types'
import fetchJson, { postCommand } from '../util/fetch-json'

type Props = typeof defaultProps & {
  user?: User
  game?: GameView
}

const defaultProps = {}

const DebugBar = ({ user, game }: Props) => {
  const handlePhaseNext = (offset: number) => async (e: React.MouseEvent) => {
    e.preventDefault()

    const phase = nextPhase(game?.phase ?? 'prep', offset)
    try {
      await fetchJson('/api/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase }),
      })
      mutate('/api/game')
    } catch (error) {
      console.error('Error updating phase.', error)
    }
  }

  const handleReveal = async (e: React.MouseEvent) => {
    e.preventDefault()
    await postCommand('reveal')
  }

  return (
    <div className="debug wrapper">
      {user?.connected && (
        <>
          <button onClick={handlePhaseNext(-1)}>&lt;</button>
          <label>{game?.phase ?? 'No Phase'}</label>
          <button onClick={handlePhaseNext(1)}>&gt;</button>

          {(game?.phase === 'guess' || game?.phase === 'direction') && (
            <button onClick={handleReveal}>reveal</button>
          )}
        </>
      )}

      <style jsx>{`
        .debug.wrapper {
          font-size: var(--font-size-sm);
          min-height: 2em;
        }

        .debug button,
        .debug a {
          padding: 0 2px;
          margin: 0 2px;
        }

        .debug label {
          width: 4.2em;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

DebugBar.defaultProps = defaultProps

export default DebugBar
