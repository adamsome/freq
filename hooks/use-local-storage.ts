/**
 * Referenced:
 * @url https://github.com/donavon/use-persisted-state
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

import { useCallback, useMemo, useState } from 'react'
import useEventListener from './use-event-listener'

interface MaybeLocalStorage {
  localStorage?: {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
  }
}

interface StorageEvent {
  type: string
  canBubble: boolean
  cancelable: boolean
  key: string
  oldValue: string
  newValue: string
}

const createLocalStore = <T>(provider?: MaybeLocalStorage) => ({
  get(key: string): T | null {
    if (!provider) {
      if (window) {
        provider = window
      } else {
        provider = {}
      }
    }
    if (!provider.localStorage) {
      // tslint:disable-next-line: no-console
      console.error(`Local Store: None found.`)
      return null
    }

    try {
      const json = provider.localStorage.getItem(key)
      const item = json ? (JSON.parse(json) as T) : null
      return item
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(`Local Store: Get error for '${key}'`, e)
      return null
    }
  },
  set(key: string, value: T | null): void {
    if (!provider) {
      if (window) {
        provider = window
      } else {
        provider = {}
      }
    }
    if (!provider.localStorage) {
      // tslint:disable-next-line: no-console
      console.error(`Local Store: None found.`)
      return
    }

    try {
      const json = JSON.stringify(value)
      provider.localStorage.setItem(key, json)
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(`Local Store: Set error for '${key}'`, value, e)
    }
  },
})

const useLocalStorage = <T>(
  key: string
): readonly [T | null, (value: T | null) => void] => {
  const localStore = useMemo(() => createLocalStore<T>(), [])

  const [storeItem, rawSetStoreItem] = useState<T | null>(() =>
    localStore.get(key)
  )

  useEventListener<StorageEvent>('storage', (e) => {
    if (e.key === key) {
      const item = JSON.parse(e.newValue) as T | null | undefined
      if (storeItem !== item) {
        rawSetStoreItem(item || null)
      }
    }
  })

  const setStoreItem = useCallback(
    (value: T | null) => {
      rawSetStoreItem(value)
      localStore.set(key, value)
    },
    [rawSetStoreItem, localStore, key]
  )

  return [storeItem, setStoreItem]
}

export default useLocalStorage
