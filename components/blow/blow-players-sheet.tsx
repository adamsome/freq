import { BottomSheet } from 'react-spring-bottom-sheet'
import { PlayerView } from '../../lib/types/game.types'
import { range } from '../../lib/util/array'
import useGame from '../../lib/util/use-game'
import SeatGrid from '../layout/seat-grid'
import PlayerSeat from './player-seat'

export default function BlowPlayersSheet() {
  const { game } = useGame()

  let players: (PlayerView | null | undefined)[] | undefined = game?.players
  if (!players) {
    // Game hasn't loaded yet, set 3 undefined to show loading skeleton
    players = range(0, 3).map(() => undefined)
  } else {
    // 3 players required to play, set rest to null to indicate waiting
    while (players.length < 3) {
      players.push(null)
    }
  }

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
