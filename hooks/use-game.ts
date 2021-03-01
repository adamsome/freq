import { useRouter } from 'next/router'
import useSWR from 'swr'
import { API_GAME } from '../lib/consts'
import { GameView } from '../types/game.types'
import { head } from '../util/array'

export interface UseGameOptions {
  refreshInterval: number
  initialData?: GameView
  useRequired?: boolean
  required?: any
}

const withDefaults = (options: Partial<UseGameOptions>): UseGameOptions => ({
  ...options,
  refreshInterval: options.refreshInterval ?? 750,
})

export default function useGame(options: Partial<UseGameOptions> = {}) {
  const router = useRouter()
  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  const { useRequired, required, ...opts } = withDefaults(options)

  const path =
    room && (useRequired ? required != null : true)
      ? API_GAME.replace('%0', room)
      : null

  const { data, error, mutate, revalidate } = useSWR<GameView>(path, opts)
  return { game: data, loading: !error && !data, error, mutate, revalidate }
}
