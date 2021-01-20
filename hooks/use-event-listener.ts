/**
 * Referenced:
 * @url https://github.com/donavon/use-event-listener
 * @date 2019-10-09
 * @license

MIT License

Copyright (c) 2018-present Donavon West

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import { useEffect, useRef } from 'react'

type EventListenerFn<E> = (
  type: string,
  listener: (e: E) => void,
  options?: boolean | AddEventListenerOptions | undefined
) => void

interface HasEventListener<E> {
  addEventListener: EventListenerFn<E>
  removeEventListener: EventListenerFn<E>
}

const useEventListener = <E = Event>(
  eventName: string,
  handler: (e: E) => void,
  provider: HasEventListener<E> = globalThis
) => {
  const savedHandler = useRef<(e: E) => void>()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (provider && provider.addEventListener) {
      const eventListener = (event: E) => {
        if (savedHandler.current) {
          savedHandler.current(event)
        }
      }
      provider.addEventListener(eventName, eventListener)
      return () => {
        if (provider && provider.removeEventListener) {
          provider.removeEventListener(eventName, eventListener)
        }
      }
    }
  }, [eventName, provider])
}

export default useEventListener
