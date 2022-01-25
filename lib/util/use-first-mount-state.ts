/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts */
import { useRef } from 'react'

export function useFirstMountState(): boolean {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}
