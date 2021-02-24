import { useCallback, useEffect, useState } from 'react'
import { THEME_KEY } from '../lib/consts'
import { isBrowser } from '../util/dom'

type Mode = 'dark' | 'light'

function getRootElementMode(): Mode | undefined {
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }
  if (document.documentElement.classList.contains('light')) {
    return 'light'
  }
}

function toMode(value: boolean): Mode
function toMode(value: boolean | undefined): Mode | undefined
function toMode(value: boolean | undefined): Mode | undefined {
  return value ? 'dark' : value === false ? 'light' : undefined
}

export default function useDarkMode(defaultValue: boolean | undefined = false) {
  const defaultMode = toMode(defaultValue)
  const [mode, setMode] = useState<Mode | undefined>(defaultMode)

  useEffect(() => {
    if (isBrowser) {
      const _mode = getRootElementMode() ?? localStorage[THEME_KEY]
      if (_mode) {
        setMode(_mode)
      }
    }
  }, [isBrowser])

  useEffect(() => {
    if (isBrowser) {
      if (mode) {
        const oppositeMode = mode === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.remove(oppositeMode)
        document.documentElement.classList.add(mode)
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.remove('light')
      }
    }
  }, [mode])

  const setDarkMode = useCallback(
    (val: boolean | undefined) => {
      const mode = toMode(val)
      if (isBrowser) {
        if (mode) {
          localStorage[THEME_KEY] = mode
        } else {
          localStorage.removeItem(THEME_KEY)
        }
      }
      setMode(mode)
    },
    [isBrowser]
  )

  const toggleDarkMode = useCallback(() => {
    setDarkMode(mode === 'light' ? true : false)
  }, [mode, setDarkMode])

  const isDarkMode =
    mode === 'dark' ? true : mode === 'light' ? false : defaultValue

  return { isDarkMode, setDarkMode, toggleDarkMode }
}
