// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/color-mode/src/storage-manager.ts

import { ColorMode } from '../types/color-mode.types'

const hasLocalStorage = typeof Storage !== 'undefined'
export const storageKey = 'freq-color-mode'

export interface StorageManager {
  get(init?: ColorMode): ColorMode | undefined
  set(value: ColorMode): void
  type: 'cookie' | 'localStorage'
}

/**
 * Simple object to handle read-write to localStorage
 */
export const localStorageManager: StorageManager = {
  get(init?) {
    if (!hasLocalStorage) {
      return init
    }

    const maybeValue = window.localStorage.getItem(storageKey) as ColorMode

    return maybeValue ?? init
  },
  set(value) {
    if (hasLocalStorage) {
      window.localStorage.setItem(storageKey, value)
    }
  },
  type: 'localStorage',
}

/**
 * Simple object to handle read-write to cookies
 */
export const cookieStorageManager = (cookies = ''): StorageManager => ({
  get(init?) {
    const match = cookies.match(new RegExp(`(^| )${storageKey}=([^;]+)`))

    if (match) {
      return match[2] as ColorMode
    }

    return init
  },
  set(value) {
    document.cookie = `${storageKey}=${value}; max-age=31536000; path=/`
  },
  type: 'cookie',
})
