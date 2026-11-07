import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { ThemeProvider } from '../lib/util/use-theme'
import { KEY_THEME } from '../lib/consts'
import fetch from '../lib/util/fetch-json'

import 'react-responsive-modal/styles.css'
import '../styles/globals.css'
import '../styles/react-responsive-modal.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: (err: unknown) => {
          console.error(err)
        },
      }}
    >
      <ThemeProvider
        defaultTheme="dark"
        enableSystem={false}
        attribute="class"
        storageKey={KEY_THEME}
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
  )
}
