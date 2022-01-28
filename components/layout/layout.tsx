import Head from 'next/head'
import type { ReactNode } from 'react'
import { GameType } from '../../lib/types/game.types'
import { __DEV__ } from '../../lib/util/assertion'
import { cx } from '../../lib/util/dom'
import { ButtonProps } from '../control/button'
import Header from './header'

type Props = {
  children: ReactNode
  className?: string
  type?: GameType
  title?: string
  room?: string
  big?: boolean
  button?: Partial<ButtonProps>
  overflowAuto?: boolean
  onLogoClick?: () => void
  onTitleClick?: () => void
}

export default function Layout({
  children,
  className = '',
  type,
  title,
  room,
  big,
  button = {},
  overflowAuto = true,
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
        'transition',
        className
      )}
    >
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

      <Header
        type={type}
        big={big}
        button={button}
        onLogoClick={onLogoClick}
        onTitleClick={onTitleClick}
      />

      <div
        className={cx(
          'flex-1 flex flex-col items-center',
          'w-full h-full',
          overflowAuto && 'overflow-auto',
          big ? 'pt-16' : 'pt-12'
        )}
      >
        {children}
      </div>
    </div>
  )
}
