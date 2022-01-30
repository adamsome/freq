/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/3685b7502a4d1980953deed11c3dee31b220c89d/src/useRafState.ts */
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import useUnmount from './use-unmount'

export default function useRafState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const frame = useRef(0)
  const [state, setState] = useState(initialState)

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(frame.current)

    frame.current = requestAnimationFrame(() => {
      setState(value)
    })
  }, [])

  useUnmount(() => {
    cancelAnimationFrame(frame.current)
  })

  return [state, setRafState]
}
