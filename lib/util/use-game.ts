import { useRouter } from 'next/router'
import useSWR, { KeyedMutator } from 'swr'
import { API_GAME } from '../consts'
import { BlowGameView } from '../types/blow.types'
import { CwdGameView } from '../types/cwd.types'
import { FreqGameView } from '../types/freq.types'
import { BaseGameView } from '../types/game.types'
import { head } from './array'

export interface UseGameOptions<T> {
  refreshInterval: number
  fallbackData?: T
  useRequired?: boolean
  required?: unknown
}

interface UseGameResult<T> {
  game: T | undefined
  loading: boolean
  error: unknown
  mutate: KeyedMutator<T>
}

const withDefaults = <T>(
  options: Partial<UseGameOptions<T>>
): UseGameOptions<T> => ({
  ...options,
  refreshInterval: options.refreshInterval ?? 750,
})

export default function useGame<T extends BaseGameView = BaseGameView>(
  options: Partial<UseGameOptions<T>> = {}
): UseGameResult<T> {
  const router = useRouter()
  const game = head(router.query?.game as string | undefined)?.toLowerCase()
  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  const { useRequired, required, ...opts } = withDefaults(options)

  const path =
    game && room && (useRequired ? required != null : true)
      ? API_GAME.replace('%0', game).replace('%1', room)
      : null

  const { data, error, mutate } = useSWR<T>(path, opts)

  const loading = !error && !data
  return { game: data, loading, error, mutate }
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

export function useBlowGame(
  options: Partial<UseGameOptions<BlowGameView>> = {}
): UseGameResult<BlowGameView> {
  return useGame<BlowGameView>(options)
}
