/*! @react-hook/resize-observer v1.2.0 | MIT License | https://github.com/jaredLunde/react-hook/blob/master/packages/resize-observer/src/index.tsx */
import type { RefObject } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import useLatest from './use-latest'
import useLayoutEffect from './use-passive-layout-effect'

/**
 * A React hook that fires a callback whenever ResizeObserver detects a change to its size
 *
 * @param target A React ref created by `useRef()` or an HTML element
 * @param callback Invoked with a single `ResizeObserverEntry` any time
 *   the `target` resizes
 */
const useResizeObserver = <T extends HTMLElement>(
  target: RefObject<T> | T | null,
  callback: UseResizeObserverCallback
): ResizeObserver => {
  const resizeObserver = getResizeObserver()
  const storedCallback = useLatest(callback)

  useLayoutEffect(() => {
    let didUnsubscribe = false

    const callback = (
      entries: ResizeObserverEntry[],
      observer: ResizeObserver
    ) => {
      if (didUnsubscribe) return
      const targetEl = target && 'current' in target ? target.current : target

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        if (entry.target === targetEl) {
          storedCallback.current(entry, observer)
        }
      }
    }

    resizeObserver.subscribe(callback)
    return () => {
      didUnsubscribe = true
      resizeObserver.unsubscribe(callback)
    }
  }, [target, resizeObserver, storedCallback])

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return
    resizeObserver.observer.observe(targetEl)
    return () => resizeObserver.observer.unobserve(targetEl)
  }, [target, resizeObserver.observer])

  return resizeObserver.observer
}

const createResizeObserver = () => {
  const callbacks: Set<ResizeObserverCallback> = new Set()
  return {
    observer: new ResizeObserver(
      (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
        for (const callback of callbacks as unknown as ResizeObserverCallback[])
          callback(entries, observer)
      }
    ),
    subscribe: (callback: ResizeObserverCallback) => callbacks.add(callback),
    unsubscribe: (callback: ResizeObserverCallback) =>
      callbacks.delete(callback),
  }
}

let _resizeObserver: ReturnType<typeof createResizeObserver>

const getResizeObserver = () =>
  !_resizeObserver
    ? (_resizeObserver = createResizeObserver())
    : _resizeObserver

export type UseResizeObserverCallback = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver
) => void

export default useResizeObserver
