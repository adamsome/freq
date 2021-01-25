import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { mutate } from 'swr'
import useColorMode from '../hooks/use-color-mode'
import useUser from '../hooks/use-user'
import { nextPhase } from '../lib/phase'
import { GameView } from '../types/game.types'
import { cx } from '../util/dom'
import { colorPlayer } from '../util/dom-style'
import fetchJson from '../util/fetch-json'
import DebugText from './debug-text'
import IconSvg from './icon-svg'
import PlayerOptions from './player-options'

type Props = typeof defaultProps & {
  children: React.ReactNode
  cookie: string
  title?: string
  game?: GameView
}

const defaultProps = {
  appName: 'Freq',
}

const Container = ({ children, cookie, appName, title, game }: Props) => {
  const [user, mutateUser] = useUser()
  const router = useRouter()
  const { colorMode, toggleColorMode } = useColorMode(cookie)
  const [showDebug, setShowDebug] = useState(false)

  // Player Options modal state
  const [modelOpen, setModelOpen] = useState(false)
  const handleModalOpen = () => setModelOpen(true)
  const handleModalClose = () => setModelOpen(false)
  const handleDebugToggle = () => setShowDebug(!showDebug)
  const handleToggleColorMode = (_e?: React.MouseEvent) => toggleColorMode()
  const handleLogout = async () => {
    await mutateUser(fetchJson('/api/logout'))
    router.push('/')
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
    <div className={cx('container', showDebug && 'show-debug')}>
      <Head>
        <title>{`${title ? `${title} | ` : ''}${appName}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        {showDebug && (
          <div className="debug wrapper">
            {user?.connected && (
              <>
                <button onClick={handlePhaseNext(-1)}>&lt;</button>
                <label>{game?.phase ?? 'No Phase'}</label>
                <button onClick={handlePhaseNext(1)}>&gt;</button>
              </>
            )}
          </div>
        )}

        <div className="wrapper">
          <h1>{game ? `Freq ${game.room.toUpperCase()}` : ''}</h1>

          {game?.currentPlayer ? (
            <button
              className="icon"
              style={colorPlayer(game.currentPlayer)}
              onClick={handleModalOpen}
            >
              {game.currentPlayer.name ?? 'Noname'}
              <div>
                <IconSvg name="dropdown" />
              </div>
            </button>
          ) : (
            <button onClick={handleToggleColorMode}>
              {colorMode === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          )}
        </div>
      </header>

      <div className="body">
        {children}

        {showDebug && <DebugText game={game} user={user} />}
      </div>

      <Modal
        open={modelOpen}
        onClose={handleModalClose}
        center
        classNames={{ modal: 'freq-model-reset-sm' }}
      >
        <PlayerOptions
          player={game?.currentPlayer}
          colorMode={colorMode}
          onDebugToggle={handleDebugToggle}
          onColorModeToggle={handleToggleColorMode}
          onLogout={handleLogout}
          onClose={handleModalClose}
        />
      </Modal>

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
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: var(--translucent-inverse-1);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        header .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 3em;
          width: 100%;
          padding: 0 var(--inset-md);
        }

        h1 {
          font-size: var(--font-size-lg);
          margin: 0;
          white-space: nowrap;
        }

        header > .wrapper > h1 {
          flex: 1;
        }

        header > .wrapper > a,
        header > .wrapper > button {
          flex: 0 0 auto;
        }

        button:hover {
          background: var(--bg-1);
        }

        button.icon {
          display: flex;
          align-items: center;
          padding-right: var(--inset-sm);
        }

        button.icon div {
          top: 2px;
          position: relative;
        }

        a {
          margin-right: var(--inset-md);
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

        .show-debug .body {
          padding-top: 5em;
        }

        header .debug.wrapper {
          font-size: var(--font-size-sm);
          min-height: 2em;
        }

        .debug button,
        .debug a {
          padding: 0 2px;
          margin: 0 2px;
        }

        .debug .label {
          width: 6em;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Container.defaultProps = defaultProps

export default Container
