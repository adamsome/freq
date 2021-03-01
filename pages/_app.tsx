import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'
import 'react-responsive-modal/styles.css'
import { SWRConfig } from 'swr'
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
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SWRConfig>
  )
}
