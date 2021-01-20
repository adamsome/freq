import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React from 'react'
import useColorMode from '../hooks/use-color-mode'
import { Game } from '../types/game.types'

type Props = typeof defaultProps & {
  children: React.ReactNode
  cookie: string
  title?: string
  game?: Game
}

const defaultProps = {
  appName: 'Freq',
}

const Container = ({ children, cookie, appName, title, game }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode(cookie)

  const handleToggleColorMode = (_e?: React.MouseEvent) => {
    toggleColorMode()
  }

  return (
    <div className="container">
      <Head>
        <title>{`${title ? `${title} | ` : ''}${appName}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>{game ? `Freq ${game.game_id.toUpperCase()}` : ''}</h1>

        <button onClick={(e) => handleToggleColorMode(e)}>
          {colorMode === 'light' ? 'Dark' : 'Light'}
        </button>
      </header>

      {children}

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        header {
          width: 100%;
          height: 68px;
          min-height: 68px;
          flex: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--stack-md); var(--inset-md);
        }

        h1 {
          font-size: var(--font-size-lg);
          margin: 0;
        }

        header > h1 {
          flex: 1;
        }

        header > button {
          flex: 0 0 auto;
          width: 5em;
        }
      `}</style>
    </div>
  )
}

Container.defaultProps = defaultProps

export const getServerSideCookie = ({ req }: GetServerSidePropsContext) => {
  return {
    props: {
      // First time users will not have any cookies and you may not return
      // undefined here, hence ?? is necessary
      cookie: req.headers.cookie ?? '',
    },
  }
}

export default Container
