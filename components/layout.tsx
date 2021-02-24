import Head from 'next/head'
import React from 'react'
import { GameView } from '../types/game.types'
import Header from './header'

type Props = typeof defaultProps & {
  children: React.ReactNode
  title?: string
  game?: GameView
}

const defaultProps = {
  appName: 'Freq',
}

const Layout = ({ children, appName, title, game }: Props) => {
  return (
    <div className="container">
      <Head>
        <meta charSet="utf-8" />
        <title>{`${appName}${title ? ` / ${title}` : ''}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>

      <Header game={game} />

      <div className="body">{children}</div>

      <style jsx>{`
        .container {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          min-height: 100%;
          padding: 0;
          overflow: hidden;
        }

        .body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          flex: 1 1 100%;
          height: 100%;
          width: 100%;
          overflow: auto;
          padding-top: 3em;
        }

        @media screen and (max-width: 480px) {
          h1 {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </div>
  )
}

Layout.defaultProps = defaultProps

export default Layout
