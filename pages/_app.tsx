import { AppProps } from 'next/app'
import '../styles/normalize.css'
import '../styles/vars.css'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
