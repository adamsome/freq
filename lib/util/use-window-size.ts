/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/master/src/useWindowSize.ts */
import { useEffect } from 'react'
import { isBrowser } from './dom'
import { off, on } from './event'
import useRafState from './use-raf-state'

export default function useWindowSize(
  initialWidth = Infinity,
  initialHeight = Infinity
) {
  const [state, setState] = useRafState<{ width: number; height: number }>({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight,
  })

  useEffect((): (() => void) | void => {
    if (isBrowser) {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      on(window, 'resize', handler)

      return () => {
        off(window, 'resize', handler)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
