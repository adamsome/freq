import { useRouter } from 'next/router'
import useSWR from 'swr'
import type { mutateCallback } from 'swr/dist/types'
import { API_GAME } from '../consts'
import { CwdGameView } from '../types/cwd.types'
import { FreqGameView } from '../types/freq.types'
import { TeamGuessGameView } from '../types/game.types'
import { head } from './array'

export interface UseGameOptions<T> {
  refreshInterval: number
  initialData?: T
  useRequired?: boolean
  required?: unknown
}

interface UseGameResult<T> {
  game: T | undefined
  loading: boolean
  error: unknown
  mutate: (
    data?: T | Promise<T> | mutateCallback<T>,
    shouldRevalidate?: boolean
  ) => Promise<T | undefined>
  revalidate: () => Promise<boolean>
}

const withDefaults = <T>(
  options: Partial<UseGameOptions<T>>
): UseGameOptions<T> => ({
  ...options,
  refreshInterval: options.refreshInterval ?? 750,
})

export default function useGame<
  T extends TeamGuessGameView = TeamGuessGameView
>(options: Partial<UseGameOptions<T>> = {}): UseGameResult<T> {
  const router = useRouter()
  const game = head(router.query?.game as string | undefined)?.toLowerCase()
  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  const { useRequired, required, ...opts } = withDefaults(options)

  const path =
    game && room && (useRequired ? required != null : true)
      ? API_GAME.replace('%0', game).replace('%1', room)
      : null

  const { data, error, mutate, revalidate } = useSWR<T>(path, opts)

  const loading = !error && !data
  return { game: data, loading, error, mutate, revalidate }
}

export function useCwdGame(
  options: Partial<UseGameOptions<CwdGameView>> = {}
): UseGameResult<CwdGameView> {
  return useGame(options)
}

export function useFreqGame(
  options: Partial<UseGameOptions<FreqGameView>> = {}
): UseGameResult<FreqGameView> {
  return useGame(options)
}
