import { BlowPlayerView } from '../../lib/types/blow.types'
import { range, shiftOrder } from '../../lib/util/array'
import { useBlowGame } from '../../lib/util/use-game'
import SeatGrid from '../layout/seat-grid'
import BlowPlayerSeat from './blow-player-seat'

export default function BlowPlayerSeatsContainer() {
  const { game } = useBlowGame()

  const players = preparePlayersArray(game?.players)

  return (
    <SeatGrid classNames="max-w-sm [--blow-card-unit:0.28125rem]">
      {players.map((p, i) => (
        <BlowPlayerSeat
          key={p?.id ?? i}
          player={p}
          actions={game?.actionState}
        />
      ))}
    </SeatGrid>
  )
}

function preparePlayersArray(
  players?: BlowPlayerView[]
): (BlowPlayerView | null | undefined)[] {
  if (!players) {
    // Game hasn't loaded yet, set 3 undefined to show loading skeleton
    return range(0, 3).map(() => undefined)
  } else {
    // Game requires a minimum of 3 players
    const size = Math.max(3, players.length)

    const playerSeats: (BlowPlayerView | null)[] = []
    for (let i = 0; i < size; i++) {
      const p = players[i]
      // If no player for this seat, set to null to indicate its empty
      playerSeats[i] = p != null ? { ...p } : null
    }

    // Shift the array order so that current player is first
    const i = playerSeats.findIndex((p) => p?.current)
    return i >= 0 ? shiftOrder(playerSeats, i) : playerSeats
  }
}
