/*! @react-hook/debounce v3.0.0 | MIT License | https://github.com/jaredLunde/react-hook/blob/master/packages/debounce/src/index.tsx */
import { useCallback, useEffect, useRef, useState } from 'react'
import useLatest from './use-latest'

export const useDebounceCallback = <CallbackArgs extends unknown[]>(
  callback: (...args: CallbackArgs) => void,
  wait = 100,
  leading = false
): ((...args: CallbackArgs) => void) => {
  const storedCallback = useLatest(callback)
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  // Cleans up pending timeouts when the deps change
  useEffect(
    () => () => {
      timeout.current && clearTimeout(timeout.current)
      timeout.current = void 0
    },
    [wait, leading, storedCallback]
  )

  return useCallback(
    function () {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments
      const { current } = timeout
      // Calls on leading edge
      if (current === void 0 && leading) {
        timeout.current = setTimeout(() => {
          timeout.current = void 0
        }, wait)
        // eslint-disable-next-line prefer-spread
        return storedCallback.current.apply(null, args as unknown)
      }
      // Clear the timeout every call and start waiting again
      current && clearTimeout(current)
      // Waits for `wait` before invoking the callback
      timeout.current = setTimeout(() => {
        timeout.current = void 0
        storedCallback.current.apply(null, args as unknown)
      }, wait)
    },
    [wait, leading, storedCallback]
  )
}

export const useDebounce = <State>(
  initialState: State | (() => State),
  wait?: number,
  leading?: boolean
): [State, React.Dispatch<React.SetStateAction<State>>] => {
  const state = useState(initialState)
  return [state[0], useDebounceCallback(state[1], wait, leading)]
}
