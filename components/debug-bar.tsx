import type { MouseEvent } from 'react'
import { API_GAME_PHASE } from '../lib/consts'
import { nextCwdPhase, nextFreqPhase } from '../lib/phase'
import { CwdPhase } from '../lib/types/cwd.types'
import { postCommand, postJson } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import Button from './button'

const defaultProps = {}

const DebugBar = () => {
  const { game } = useGame()
  if (!game) return null

  const handlePhaseNext = (offset: number) => async (e: MouseEvent) => {
    e.preventDefault()
    if (!game) return

    const phase =
      game.type === 'freq'
        ? nextFreqPhase(game?.phase ?? 'prep', offset)
        : nextCwdPhase((game?.phase ?? 'prep') as CwdPhase, offset)

    try {
      await postJson(
        API_GAME_PHASE.replace('%0', game.type).replace('%1', game.room),
        { phase }
      )
    } catch (error) {
      console.error('Error updating phase.', error)
    }
  }

  const handleReveal = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!game) return
    await postCommand(game.type, game?.room, 'reveal_round_results')
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
