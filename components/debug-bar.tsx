import React from 'react'
import useGame from '../hooks/use-game'
import { API_GAME_PHASE } from '../lib/consts'
import { nextPhase } from '../lib/phase'
import { postCommand, postJson } from '../util/fetch-json'
import Button from './button'

const defaultProps = {}

const DebugBar = () => {
  const { game } = useGame()

  const handlePhaseNext = (offset: number) => async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!game) return

    const phase = nextPhase(game?.phase ?? 'prep', offset)

    try {
      await postJson(API_GAME_PHASE, { phase })
    } catch (error) {
      console.error('Error updating phase.', error)
    }
  }

  const handleReveal = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!game) return
    await postCommand(game?.room, 'reveal_round_results')
  }

  return (
    <div className="h-6 pt-2">
      <Button className="mx-1" onClick={handlePhaseNext(-1)}>
        &lt;
      </Button>
      <label>{game?.phase ?? 'No Phase'}</label>
      <Button className="mx-1" onClick={handlePhaseNext(1)}>
        &gt;
      </Button>

      {(game?.phase === 'guess' || game?.phase === 'direction') && (
        <Button onClick={handleReveal}>reveal</Button>
      )}
    </div>
  )
}

DebugBar.defaultProps = defaultProps

export default DebugBar
