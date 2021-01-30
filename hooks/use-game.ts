import useSWR from 'swr'
import { GameView } from '../types/game.types'

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
  const { data, error, mutate } = useSWR<GameView>('/api/game', {
    initialData,
    refreshInterval,
  })

  return [data, error, mutate] as const
}
