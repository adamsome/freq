import { BottomSheet } from 'react-spring-bottom-sheet'
import { PlayerView } from '../../lib/types/game.types'
import { range, shiftOrder } from '../../lib/util/array'
import useGame from '../../lib/util/use-game'
import SeatGrid from '../layout/seat-grid'
import PlayerSeat from './player-seat'

export default function BlowPlayersSheet() {
  const { game } = useGame()

  const players = preparePlayersArray(game?.players)

  return (
    <BottomSheet
      open
      skipInitialTransition
      expandOnContentDrag
      blocking={false}
      snapPoints={({ minHeight, maxHeight }) => [
        maxHeight - maxHeight / 10,
        minHeight,
        maxHeight * 0.6,
      ]}
      defaultSnap={({ minHeight }) => minHeight}
    >
      <div className="flex-center px-2 pb-5">
        <SeatGrid classNames="max-w-sm">
          {players.map((p, i) => (
            <PlayerSeat key={p?.id ?? i} player={p} />
          ))}
        </SeatGrid>
      </div>
    </BottomSheet>
  )
}

function preparePlayersArray(
  players?: PlayerView[]
): (PlayerView | null | undefined)[] {
  if (!players) {
    // Game hasn't loaded yet, set 3 undefined to show loading skeleton
    return range(0, 3).map(() => undefined)
  } else {
    // Game requires a minimum of 3 players
    const size = Math.max(3, players.length)

    const playerSeats: (PlayerView | null)[] = []
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
