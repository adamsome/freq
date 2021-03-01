/*! @react-hook/latest v1.0.3 | MIT License | https://github.com/jaredLunde/react-hook/tree/master/packages/latest#readme */
import * as React from 'react'

const useLatest = <T extends any>(current: T) => {
  const storedValue = React.useRef(current)
  React.useEffect(() => {
    storedValue.current = current
  })
  return storedValue
}

export default useLatest
