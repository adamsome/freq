// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/color-mode/src/storage-manager.ts

import { HasResponseSetHeader } from '../types/io.types'
import { setCookieOnServer } from './cookie'

const hasLocalStorage = typeof Storage !== 'undefined'

export type StorageKeys = 'freq-color-mode' | 'freq-player-id'

interface SetOptions {
  serverResponse: HasResponseSetHeader
}

export interface StorageManager<T extends string = string> {
  get(key: StorageKeys, init?: T): T | undefined
  set(key: StorageKeys, value: T, options?: SetOptions): void
  type: 'cookie' | 'localStorage'
}

/**
 * Simple object to handle read-write to localStorage
 */
export const localStorageManager = <
  T extends string = string
>(): StorageManager<T> => ({
  get(key, init?) {
    if (!hasLocalStorage) {
      return init
    }

    const maybeValue = window.localStorage.getItem(key) as T

    return maybeValue ?? init
  },
  set(key, value) {
    if (hasLocalStorage) {
      window.localStorage.setItem(key, value)
    }
  },
  type: 'localStorage',
})

/**
 * Simple object to handle read-write to cookies
 */
export const cookieStorageManager = <T extends string = string>(
  cookies = ''
): StorageManager<T> => ({
  get(key, init?) {
    const match = cookies.match(new RegExp(`(^| )${key}=([^;]+)`))

    if (match) {
      return match[2] as T
    }

    return init
  },
  set(key, value, opts) {
    if (opts?.serverResponse) {
      setCookieOnServer(opts.serverResponse, key, value)
    } else {
      document.cookie = `${key}=${value}; max-age=31536000; path=/`
    }
  },
  type: 'cookie',
})
