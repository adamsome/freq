import Head from 'next/head'
import { __DEV__ } from '../../lib/util/assertion'

type Props = {
  title?: string
  room?: string
}

export default function Helmet({ title, room }: Props) {
  const titlePrefix = `${title ?? ''}${room ? ` / ${room}` : ''}`
  const fullTitle = `${titlePrefix}${titlePrefix ? ' / ' : ''}adamsome`
  return (
    <Head>
      <meta charSet="utf-8" />
      <title>{fullTitle}</title>

      <link
        rel="icon"
        href={__DEV__ ? '/favicon-invert.ico' : '/favicon.ico'}
      />
      <link
        rel="icon"
        href={__DEV__ ? '/icon-invert.svg' : '/icon.svg'}
        type="image/svg+xml"
      />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />

      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
    </Head>
  )
}
