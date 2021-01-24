import useSWR from 'swr'
import { GameView } from '../types/game.types'

const DEBUG_ALLOW_REFRESH = false

export default function useGame(
  initialData?: GameView,
  disableRefresh = false
) {
  const [data, , mutate] = useGameWithError(initialData, disableRefresh)
  return [data, mutate] as const
}

export function useGameWithError(
  initialData?: GameView,
  disableRefresh = false
) {
  const { data, error, mutate } = useSWR<GameView>('/api/game', {
    initialData,
    refreshInterval: disableRefresh || !DEBUG_ALLOW_REFRESH ? 0 : 1500,
  })

  return [data, error, mutate] as const
}
