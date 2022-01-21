import produce from 'immer'
import { BlowAction, BlowPlayerView } from '../../lib/types/blow.types'
import { Command, CommandError } from '../../lib/types/game.types'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import BlowPlayerSeatsGrid from './blow-player-seats-grid'
import BlowPlayerSeatsShuffle from './blow-player-seats-shuffle'

type Props = {
  onPlayerClick?: (player: BlowPlayerView) => void
  onCommandError?: (error: CommandError) => void
}

export default function BlowPlayerSeatsContainer(props: Props) {
  const { game, mutate } = useBlowGame()

  const { currentPlayer, pickTarget } = game ?? {}
  const { action, targets, fetching } = pickTarget ?? {}

  const isTargetable = (p?: BlowPlayerView | null): boolean => {
    if (!p) return false
    if (fetching != null && fetching !== p.index) return false
    if (!currentPlayer?.active) return false
    return targets?.includes(p.index) ?? false
  }

  const { onPlayerClick, onCommandError } = props

  const handlePlayerClick = async (p: BlowPlayerView) => {
    if (!isTargetable(p)) return onPlayerClick?.(p)
    if (fetching != null || !game || !action) return

    const { type, payload } = action
    const target = p.index
    const value: BlowAction = { type, payload: { ...payload, target } }
    try {
      await postCommand(game.type, game.room, 'action', value)
      mutate(
        produce((game) => {
          if (game.pickTarget) game.pickTarget.fetching = p.index
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting command action ${action.type}.`, data)
      const command: Command = { type: 'action', text: action.type }
      onCommandError?.({ command, data, message, date: new Date() })
    }
  }

  return (
    <>
      <BlowPlayerSeatsGrid game={game} onPlayerClick={handlePlayerClick} />

      {game?.phase === 'prep' && (
        <div className="absolute full flex-center">
          <BlowPlayerSeatsShuffle onCommandError={onCommandError} />
        </div>
      )}
    </>
  )
}
