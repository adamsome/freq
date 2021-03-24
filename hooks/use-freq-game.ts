import { useRouter } from 'next/router'
import useSWR from 'swr'
import { API_FREQ_GAME } from '../lib/consts'
import { FreqGameView } from '../types/freq.types'
import { head } from '../util/array'

export interface UseGameOptions {
  refreshInterval: number
  initialData?: FreqGameView
  useRequired?: boolean
  required?: any
}

const withDefaults = (options: Partial<UseGameOptions>): UseGameOptions => ({
  ...options,
  refreshInterval: options.refreshInterval ?? 750,
})

export default function useFreqGame(options: Partial<UseGameOptions> = {}) {
  const router = useRouter()
  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  const { useRequired, required, ...opts } = withDefaults(options)

  const path =
    room && (useRequired ? required != null : true)
      ? API_FREQ_GAME.replace('%0', room)
      : null

  const { data, error, mutate, revalidate } = useSWR<FreqGameView>(path, opts)
  return { game: data, loading: !error && !data, error, mutate, revalidate }
}
