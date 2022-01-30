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
  contentClassName?: string
  type?: GameType
  title?: string
  room?: string
  big?: boolean
  button?: Partial<ButtonProps>
  flexWrapper?: boolean
  overflowAuto?: boolean
  sticky?: boolean
  onLogoClick?: () => void
  onTitleClick?: () => void
}

export default function Layout(props: Props) {
  const {
    children,
    className,
    contentClassName,
    title,
    room,
    big,
    flexWrapper = true,
    overflowAuto = true,
    ...headerProps
  } = props
  return (
    <>
      <Wrapper className={className} flexWrapper={flexWrapper}>
        <Helmet title={title} room={room} />

        <Header {...headerProps} />

        <ContentWrapper
          className={contentClassName}
          big={big}
          overflowAuto={overflowAuto}
          flexWrapper={flexWrapper}
        >
          {children}
        </ContentWrapper>
      </Wrapper>
    </>
  )
}

function Wrapper(props: Props) {
  const { children, className, flexWrapper } = props
  if (!flexWrapper) return <div className={className}>{children}</div>
  return (
    <div
      className={cx(
        'flex-center flex-col min-h-screen min-w-min overflow-hidden',
        'bg-white dark:bg-black text-black dark:text-white',
        'transition',
        className
      )}
    >
      {children}
    </div>
  )
}

function ContentWrapper(props: Props) {
  const { children, className, big, overflowAuto, flexWrapper } = props
  return (
    <div
      className={cx(
        className,
        flexWrapper && {
          'flex-1 flex flex-col items-center': true,
          'w-full h-full': true,
          'overflow-auto': overflowAuto,
          'pt-16': big,
          'pt-12': !big,
        }
      )}
    >
      {children}
    </div>
  )
}

function Helmet(props: Omit<Props, 'children'>) {
  const { title, room } = props
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
