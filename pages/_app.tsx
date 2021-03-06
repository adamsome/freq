import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'
import 'react-responsive-modal/styles.css'
import { SWRConfig } from 'swr'
import { ThemeProvider } from '../hooks/use-theme'
import { KEY_THEME } from '../lib/consts'
import '../styles/globals.css'
import fetch from '../util/fetch-json'

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
