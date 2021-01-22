// From jaredLunde/react-hook
// License: https://github.com/jaredLunde/react-hook/blob/master/LICENSE
// Source: https://github.com/jaredLunde/react-hook/tree/master/packages/latest#readme

import * as React from 'react'

const useLatest = <T extends any>(current: T) => {
  const storedValue = React.useRef(current)
  React.useEffect(() => {
    storedValue.current = current
  })
  return storedValue
}

export default useLatest
