/*! @streamich/react-use v17.3.2 | The Unlicense | https://github.com/streamich/react-use/blob/3685b7502a4d1980953deed11c3dee31b220c89d/src/useEffectOnce.ts */
import { EffectCallback, useEffect } from 'react'

export default function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
