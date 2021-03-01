import Head from 'next/head'
import React from 'react'
import { cx } from '../util/dom'
import Header from './header'

type Props = typeof defaultProps & {
  children: React.ReactNode
  title?: string
}

const defaultProps = {
  appName: 'Freq',
}

const Layout = ({ children, appName, title }: Props) => {
  return (
    <div
      className={cx(
        'flex-center flex-col min-h-screen min-w-min overflow-hidden',
        'bg-white dark:bg-black text-black dark:text-white',
        'transition'
      )}
    >
      <Head>
        <meta charSet="utf-8" />
        <title>{`${appName}${title ? ` / ${title}` : ''}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>

      <Header />

      <div
        className={cx(
          'flex-1 flex flex-col items-center',
          'w-full h-full pt-12 overflow-auto'
        )}
      >
        {children}
      </div>
    </div>
  )
}

Layout.defaultProps = defaultProps

export default Layout
