/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts */
import { useEffect } from 'react'
import { useFirstMountState } from './use-first-mount-state'

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState()

  useEffect(() => {
    if (!isFirstMount) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect
