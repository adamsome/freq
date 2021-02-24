import React from 'react'
import { mutate } from 'swr'
import { API_GAME_PHASE } from '../lib/consts'
import { nextPhase } from '../lib/phase'
import { GameView } from '../types/game.types'
import { postCommand, postJson } from '../util/fetch-json'

type Props = typeof defaultProps & {
  game?: GameView
}

const defaultProps = {}

const DebugBar = ({ game }: Props) => {
  const handlePhaseNext = (offset: number) => async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!game) return

    const phase = nextPhase(game?.phase ?? 'prep', offset)

    try {
      await postJson(API_GAME_PHASE, { phase })
      mutate('/api/game')
    } catch (error) {
      console.error('Error updating phase.', error)
    }
  }

  const handleReveal = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!game) return
    await postCommand(game?.room, 'reveal')
  }

  return (
    <div className="debug wrapper">
      <button onClick={handlePhaseNext(-1)}>&lt;</button>
      <label>{game?.phase ?? 'No Phase'}</label>
      <button onClick={handlePhaseNext(1)}>&gt;</button>

      {(game?.phase === 'guess' || game?.phase === 'direction') && (
        <button onClick={handleReveal}>reveal</button>
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
