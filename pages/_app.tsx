import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import fetch from '../util/fetch-json'

// Do not modify order (normaize, ...vendors, global, vars)
import '../styles/normalize.css'
import 'react-responsive-modal/styles.css'
import '../styles/global.css'
import '../styles/vars.css'

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
