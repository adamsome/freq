import { useRouter } from 'next/router'
import GameBoard from '../../components/game-board'
import GameGuard from '../../components/game-guard'
import { GameType } from '../../types/game.types'
import { head } from '../../util/array'

export default function FreqRoomPage() {
  const router = useRouter()
  const type = head(router.query?.game)?.toLowerCase() as GameType | undefined
  const room = head(router.query?.room as string | undefined)?.toLowerCase()
  return (
    <GameGuard type={type} room={room}>
      <GameBoard type={type} />
    </GameGuard>
  )
}
