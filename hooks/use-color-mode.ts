import { useCallback, useEffect, useState } from 'react'
import { ColorMode } from '../types/color-mode.types'
import { isBrowser } from '../util/dom'
import {
  cookieStorageManager,
  localStorageManager,
} from '../util/storage-manager'

const colorModeKey = 'freq-color-mode'

export const root = {
  get: () =>
    document.documentElement.style.getPropertyValue(
      '--freq-color-mode'
    ) as ColorMode,
  set: (mode: ColorMode) => {
    if (isBrowser) {
      document.documentElement.style.setProperty('--freq-color-mode', mode)
    }
  },
}

const useColorMode = (cookie?: string) => {
  const colorModeManager =
    typeof cookie === 'string'
      ? cookieStorageManager<ColorMode>(cookie)
      : localStorageManager<ColorMode>()

  /**
   * Only attempt to retrieve if we're on the server. Else this will result
   * in a hydration mismatch warning and partially invalid visuals.
   *
   * Else fallback safely to `theme.config.initialColormode` (default light)
   */
  const [colorMode, rawSetColorMode] = useState(
    colorModeManager.type === 'cookie'
      ? colorModeManager.get(colorModeKey, 'dark')
      : 'dark'
  )

  useEffect(() => {
    /**
     * Since we cannot initially retrieve localStorage to due above mentioned
     * reasons, do so after hydration.
     *
     * Priority:
     * - defined value on <ColorModeScript />, if present
     * - previously stored value
     */
    if (isBrowser && colorModeManager.type === 'localStorage') {
      const _colorMode = root.get() || colorModeManager.get(colorModeKey)

      if (_colorMode) {
        rawSetColorMode(_colorMode)
      }
    }
  }, [colorModeManager])

  useEffect(() => {
    root.set(colorMode ?? 'dark')
  }, [colorMode])

  const setColorMode = useCallback(
    (value: ColorMode) => {
      colorModeManager.set(colorModeKey, value)
      rawSetColorMode(value)
    },
    [colorModeManager]
  )

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }, [colorMode, setColorMode])

  return { colorMode, setColorMode, toggleColorMode } as const
}

export default useColorMode
