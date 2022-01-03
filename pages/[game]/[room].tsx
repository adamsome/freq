import { useRouter } from 'next/router'
import GameGuard from '../../components/game-guard'
import TeamGameBoard from '../../components/team-game-board'
import { GameType } from '../../lib/types/game.types'
import { head } from '../../lib/util/array'

export default function FreqRoomPage() {
  const router = useRouter()
  const type = head(router.query?.game)?.toLowerCase() as GameType | undefined
  const room = head(router.query?.room as string | undefined)?.toLowerCase()
  return (
    <GameGuard type={type} room={room}>
      <TeamGameBoard type={type} />
    </GameGuard>
  )
}
