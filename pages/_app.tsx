import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import fetch from '../util/fetch-json'

import '../styles/normalize.css'
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
      <Component {...pageProps} />
    </SWRConfig>
  )
}
