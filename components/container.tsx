import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { mutate } from 'swr'
import useColorMode from '../hooks/use-color-mode'
import useUser from '../hooks/use-user'
import { nextPhase } from '../lib/phase'
import { Game } from '../types/game.types'
import fetchJson from '../util/fetch-json'

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
  const [user, mutateUser] = useUser()
  const router = useRouter()
  const { colorMode, toggleColorMode } = useColorMode(cookie)

  const handleToggleColorMode = (_e?: React.MouseEvent) => {
    toggleColorMode()
  }

  const handlePhaseNext = (offset: number) => async (e: React.MouseEvent) => {
    e.preventDefault()

    const phase = nextPhase(game?.phase ?? 'prep', offset)
    try {
      await fetchJson('/api/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase }),
      })
      mutate('/api/game')
    } catch (error) {
      console.error('Error updating phase.', error)
    }
  }

  return (
    <div className="container">
      <Head>
        <title>{`${title ? `${title} | ` : ''}${appName}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>{game ? `Freq ${game.room.toUpperCase()}` : ''}</h1>

        {user?.connected && (
          <>
            <div className="debug-phase">
              <button onClick={handlePhaseNext(-1)}>&lt;</button>
              <div>{game?.phase ?? 'No Phase'}</div>
              <button onClick={handlePhaseNext(1)}>&gt;</button>
            </div>
            {'/'}
            <a
              href="/api/logout"
              onClick={async (e) => {
                e.preventDefault()
                await mutateUser(fetchJson('/api/logout'))
                router.push('/')
              }}
            >
              Leave
            </a>
          </>
        )}

        <button onClick={(e) => handleToggleColorMode(e)}>
          {colorMode === 'light' ? 'Dark' : 'Light'}
        </button>
      </header>

      <div className="body">{children}</div>

      <style jsx>{`
        .container {
          position: relative;
          height: 100vh;
          min-height: 100vh;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        header {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          min-height: 3em;
          flex: 0 0 3em;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--stack-md); var(--inset-md);
          border-bottom: 1px solid var(--border);
          background: var(--translucent-inverse-1);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          flex: 1 1 100%;
          width: 100%;
          overflow: auto;
          padding-top: 3em;
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

        a {
          margin-right: var(--inset-md);
        }

        .debug-phase {
          display: flex;
        }

        .debug-phase div {
          width: 6em;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Container.defaultProps = defaultProps

export default Container
