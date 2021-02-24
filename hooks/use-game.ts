import { useRouter } from 'next/router'
import useSWR from 'swr'
import { API_GAME } from '../lib/consts'
import { GameView } from '../types/game.types'
import { head } from '../util/array'

export default function useGame(
  initialData?: GameView,
  refreshInterval = 1000
) {
  const [data, , mutate] = useGameWithError(initialData, refreshInterval)
  return [data, mutate] as const
}

export function useGameWithError(
  initialData?: GameView,
  refreshInterval = 1000
) {
  const router = useRouter()
  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  if (!room) {
    throw new TypeError(`Room required to fetch game state`)
  }

  const { data, error, mutate } = useSWR<GameView>(`${API_GAME}/${room}`, {
    initialData,
    refreshInterval,
  })

  return [data, error, mutate] as const
}
