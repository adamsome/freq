import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False during the server render and hydration, true afterwards. Use it to
 * gate client-only values (e.g. localStorage) without a mismatch and
 * without setting state in an effect.
 */
export default function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
