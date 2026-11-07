/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts */
import { useEffect, useRef } from 'react'

/** Like useEffect, but skips the run after the first render. */
const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect
