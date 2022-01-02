/*! @react-hook/passive-layout-effect v1.2.1 | MIT License | https://github.com/jaredLunde/react-hook/tree/master/packages/passive-layout-effect#readme */
import * as React from 'react'

const usePassiveLayoutEffect =
  React[
    typeof document !== 'undefined' && document.createElement !== void 0
      ? 'useLayoutEffect'
      : 'useEffect'
  ]

export default usePassiveLayoutEffect
