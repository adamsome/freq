/*! @react-hook/latest v1.0.3 | MIT License | https://github.com/jaredLunde/react-hook/tree/master/packages/latest#readme */
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

const useLatest = <T>(current: T): MutableRefObject<T> => {
  const storedValue = useRef(current)
  useEffect(() => {
    storedValue.current = current
  })
  return storedValue
}

export default useLatest
