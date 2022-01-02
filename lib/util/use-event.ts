/*! @react-hook/event v1.2.3 | MIT License | https://github.com/jaredLunde/react-hook/tree/master/packages/event#readme */
import type { RefObject } from 'react'
import { useRef } from 'react'
import useLayoutEffect from './use-passive-layout-effect'

/* eslint-disable @typescript-eslint/no-explicit-any */

function useEvent<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends Window = Window,
  K extends keyof WindowEventMap = keyof WindowEventMap
>(
  target: Window | null,
  type: K,
  listener: WindowEventListener<K>,
  cleanup?: (...args: unknown[]) => void
): void
function useEvent<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends Document = Document,
  K extends keyof DocumentEventMap = keyof DocumentEventMap
>(
  target: Document | null,
  type: K,
  listener: DocumentEventListener<K>,
  cleanup?: (...args: unknown[]) => void
): void
function useEvent<
  T extends HTMLElement = HTMLElement,
  K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
>(
  target: RefObject<T> | T | null,
  type: K,
  listener: ElementEventListener<K>,
  cleanup?: (...args: unknown[]) => void
): void
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useEvent(target: any, type: any, listener: any, cleanup: any): void {
  const storedListener = useRef(listener)
  const storedCleanup = useRef(cleanup)

  useLayoutEffect(() => {
    storedListener.current = listener
    storedCleanup.current = cleanup
  })

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return

    let didUnsubscribe = 0
    function listener(this: any, ...args: any[]) {
      if (didUnsubscribe) return
      storedListener.current.apply(this, args)
    }

    targetEl.addEventListener(type, listener)
    const cleanup = storedCleanup.current

    return () => {
      didUnsubscribe = 1
      targetEl.removeEventListener(type, listener)
      cleanup && cleanup()
    }
  }, [target, type])
}

export type ElementEventListener<
  K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
> = (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown

export type DocumentEventListener<
  K extends keyof DocumentEventMap = keyof DocumentEventMap
> = (this: Document, ev: DocumentEventMap[K]) => unknown

export type WindowEventListener<
  K extends keyof WindowEventMap = keyof WindowEventMap
> = (this: Document, ev: WindowEventMap[K]) => unknown

export default useEvent
