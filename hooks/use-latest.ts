/*! @react-hook/latest v1.0.3 | MIT License | https://github.com/jaredLunde/react-hook/tree/master/packages/latest#readme */
import { useRef, useEffect } from 'react'

const useLatest = <T extends any>(current: T) => {
  const storedValue = useRef(current)
  useEffect(() => {
    storedValue.current = current
  })
  return storedValue
}

export default useLatest
