import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'
import 'react-responsive-modal/styles.css'
import { SWRConfig } from 'swr'
import { ThemeProvider } from '../lib/util/use-theme'
import { KEY_THEME } from '../lib/consts'
import fetch from '../lib/util/fetch-json'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: (err: any) => {
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
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    </SWRConfig>
  )
}
