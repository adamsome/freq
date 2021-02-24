import * as React from 'react'

function setDarkModeClass() {
  if (
    localStorage['freq/theme'] === 'dark' ||
    (!('freq/theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }
}

/**
 * Used to inline in HTML `<head>` to avoid flash-of-unstyled-content (FOUC)
 */
export const DarkModeScript = (): JSX.Element => {
  const html = `(${String(setDarkModeClass)})()`
  return <script dangerouslySetInnerHTML={{ __html: html }} />
}
