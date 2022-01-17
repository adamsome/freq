import produce from 'immer'
import { BlowAction, BlowPlayerView } from '../../lib/types/blow.types'
import { Command, CommandError } from '../../lib/types/game.types'
import { range, shiftOrder } from '../../lib/util/array'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import SeatGrid from '../layout/seat-grid'
import BlowPlayerSeat from './blow-player-seat'
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

  const { players: rawPlayers, player_order: order } = game ?? {}
  const { players, firstPlayerID } = preparePlayersArray(rawPlayers, order)

  return (
    <>
      <SeatGrid classNames="max-w-sm [--blow-card-unit:0.28125rem]">
        {players.map((p, i) => (
          <BlowPlayerSeat
            key={p?.id ?? i}
            player={p}
            active={p?.id === firstPlayerID}
            actions={game?.actionState}
            card={{ color: 'gray' }}
            targetable={isTargetable(p)}
            onClick={handlePlayerClick}
          />
        ))}
      </SeatGrid>

      {game?.phase === 'prep' && (
        <div className="absolute full flex-center">
          <BlowPlayerSeatsShuffle onCommandError={onCommandError} />
        </div>
      )}
    </>
  )
}

interface PreparePlayersResult {
  players: (BlowPlayerView | null | undefined)[]
  firstPlayerID: string | null
}

function preparePlayersArray(
  players?: BlowPlayerView[],
  order?: number[]
): PreparePlayersResult {
  if (!players || !order) {
    // Game hasn't loaded yet, set 3 undefined to show loading skeleton
    return { players: range(0, 3).map(() => undefined), firstPlayerID: null }
  } else {
    // Game requires a minimum of 3 players
    const size = Math.max(3, players.length)

    const playerSeats: (BlowPlayerView | null)[] = []
    for (let seatIndex = 0; seatIndex < size; seatIndex++) {
      const index: number | undefined = order[seatIndex]
      const p = index != null ? players[index] : null
      // If no player for this seat, set to null to indicate its empty
      playerSeats[seatIndex] = p != null ? { ...p } : null
    }

    const firstPlayerID = playerSeats[0] != null ? playerSeats[0].id : null

    // Shift the array order so that current player is first
    const i = playerSeats.findIndex((p) => p?.current)
    const _players = i >= 0 ? shiftOrder(playerSeats, i) : playerSeats

    return { players: _players, firstPlayerID }
  }
}
