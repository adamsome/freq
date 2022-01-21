import { BlowGameView, BlowPlayerView } from '../../lib/types/blow.types'
import { range, shiftOrder } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import SeatGrid from '../layout/seat-grid'
import BlowPlayerSeat from './blow-player-seat'

type Props = {
  className?: string
  game?: BlowGameView
  onPlayerClick?: (player: BlowPlayerView) => void
}

export default function BlowPlayerSeatsGrid(props: Props) {
  const { className, game, onPlayerClick } = props
  const { phase, currentPlayer, pickTarget } = game ?? {}
  const { targets, fetching } = pickTarget ?? {}

  const isTargetable = (p?: BlowPlayerView | null): boolean => {
    if (!p) return false
    if (fetching != null && fetching !== p.index) return false
    if (!currentPlayer?.active) return false
    return targets?.includes(p.index) ?? false
  }

  const { players: rawPlayers, player_order: order } = game ?? {}
  const { players, firstPlayerID } = preparePlayersArray(rawPlayers, order)

  return (
    <>
      <SeatGrid
        classNames={cx(className, 'max-w-sm [--blow-card-unit:0.28125rem]')}
      >
        {players.map((p, i) => (
          <BlowPlayerSeat
            key={p?.id ?? i}
            player={p}
            active={phase === 'prep' && p?.id === firstPlayerID}
            actions={game?.actionState}
            card={{ color: 'gray' }}
            targetable={isTargetable(p)}
            onClick={onPlayerClick}
          />
        ))}
      </SeatGrid>
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
