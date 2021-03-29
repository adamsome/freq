import Head from 'next/head'
import React from 'react'
import { GameType } from '../types/game.types'
import { cx } from '../util/dom'
import Header from './header'

type Props = typeof defaultProps & {
  children: React.ReactNode
  type?: GameType
  title?: string
  room?: string
  big?: boolean
  onLogoClick?: () => void
  onTitleClick?: () => void
}

const defaultProps = {}

export default function Layout({
  children,
  type,
  title,
  room,
  big,
  onLogoClick,
  onTitleClick,
}: Props) {
  const titlePrefix = `${title ?? ''}${room ? ` / ${room}` : ''}`
  const fullTitle = `${titlePrefix}${titlePrefix ? ' / ' : ''}adamsome`

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
        <title>{fullTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>

      <Header
        type={type}
        big={big}
        onLogoClick={onLogoClick}
        onTitleClick={onTitleClick}
      />

      <div
        className={cx(
          'flex-1 flex flex-col items-center',
          'w-full h-full overflow-auto',
          big ? 'pt-16' : 'pt-12'
        )}
      >
        {children}
      </div>
    </div>
  )
}

Layout.defaultProps = defaultProps
