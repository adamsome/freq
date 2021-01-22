// From jaredLunde/react-hook
// License: https://github.com/jaredLunde/react-hook/blob/master/LICENSE
// Source: https://github.com/jaredLunde/react-hook/tree/master/packages/passive-layout-effect#readme

import React from 'react'

const usePassiveLayoutEffect =
  React[
    typeof document !== 'undefined' && document.createElement !== void 0
      ? 'useLayoutEffect'
      : 'useEffect'
  ]

export default usePassiveLayoutEffect
