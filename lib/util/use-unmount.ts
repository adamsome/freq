/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/3685b7502a4d1980953deed11c3dee31b220c89d/src/useUnmount.ts */
import { useRef } from 'react'
import useEffectOnce from './use-effect-once'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useUnmount(fn: () => any): void {
  const fnRef = useRef(fn)

  // Update the ref each render so if it change the newest callback
  // will be invoked
  fnRef.current = fn

  useEffectOnce(() => () => fnRef.current())
}
