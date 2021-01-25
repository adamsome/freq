// From chakra-ui
// License: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/LICENSE
// Source: https://github.com/chakra-ui/chakra-ui/blob/4478509039b4ed9df8a7710f49b12588e1202de2/packages/color-mode/src/color-mode-script.tsx

import * as React from 'react'
import { ColorMode } from '../types/color-mode.types'

type Mode = ColorMode | 'system' | undefined

function setScript(initialValue: Mode) {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const systemPreference = mql.matches ? 'dark' : 'light'

  let persistedPreference: Mode

  try {
    persistedPreference = localStorage.getItem('freq/color-mode') as Mode
  } catch (error) {
    console.warn(
      '`localStorage` is not available. ' +
        'Color mode persistence might not work as expected'
    )
  }

  const isInStorage = typeof persistedPreference === 'string'

  let colorMode: Mode

  if (isInStorage) {
    colorMode = persistedPreference
  } else {
    colorMode = initialValue === 'system' ? systemPreference : initialValue
  }

  if (colorMode) {
    const root = document.documentElement
    root.style.setProperty('--freq-color-mode', colorMode)
  }
}

interface ColorModeScriptProps {
  initialColorMode?: Mode
}

/**
 * Script to add to the root of your application when using localStorage,
 * to help prevent flash of color mode that can happen during page load.
 */
export const ColorModeScript = (props: ColorModeScriptProps): JSX.Element => {
  const { initialColorMode = 'system' } = props
  const html = `(${String(setScript)})('${initialColorMode}')`
  return <script dangerouslySetInnerHTML={{ __html: html }} />
}
