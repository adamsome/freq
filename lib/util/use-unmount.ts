/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/3685b7502a4d1980953deed11c3dee31b220c89d/src/useUnmount.ts */
import { useEffect, useRef } from 'react'
import useEffectOnce from './use-effect-once'

export default function useUnmount(fn: () => unknown): void {
  const fnRef = useRef(fn)

  // Keep the latest callback so the newest one runs on unmount.
  useEffect(() => {
    fnRef.current = fn
  })

  useEffectOnce(() => () => {
    fnRef.current()
  })
}
