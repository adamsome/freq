/*! @react-hook/size v2.1.1 | MIT License | https://github.com/jaredLunde/react-hook/blob/master/packages/size/src/index.tsx */
import { useState } from 'react'
import useLayoutEffect from './use-passive-layout-effect'
import useResizeObserver from './use-resize-observer'

/**
 * A React hook for measuring the size of HTML elements including when they change
 *
 * @param target A React ref created by `useRef()` or an HTML element
 * @param options Configures the initial width and initial height of the hook's state
 */
const useSize = <T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options?: UseSizeOptions
): [number, number] => {
  const [size, setSize] = useState<[number, number]>(() => {
    const targetEl = target && 'current' in target ? target.current : target
    return targetEl
      ? [targetEl.offsetWidth, targetEl.offsetHeight]
      : [options?.initialWidth ?? 0, options?.initialHeight ?? 0]
  })

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return
    setSize([targetEl.offsetWidth, targetEl.offsetHeight])
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    const target = entry.target as HTMLElement
    setSize([target.offsetWidth, target.offsetHeight])
  })

  return size
}

export interface UseSizeOptions {
  // The initial width to set into state.
  // This is useful for SSR environments.
  initialWidth: number
  // The initial height to set into state.
  // This is useful for SSR environments.
  initialHeight: number
}

export default useSize
