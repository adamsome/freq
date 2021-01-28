import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import useColorMode from '../hooks/use-color-mode'
import useUser from '../hooks/use-user'
import { GameView } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import fetchJson from '../util/fetch-json'
import DebugBar from './debug-bar'
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

  return (
    <div className={cx('container', showDebug && 'show-debug')}>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${title ? `${title} | ` : ''}${appName}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>

      <header>
        {showDebug && <DebugBar game={game} user={user} />}

        <div className="wrapper">
          <h1>{game ? `Freq ${game.room.toUpperCase()}` : ''}</h1>

          {game?.currentPlayer ? (
            <button
              className="icon"
              style={styleColor(game.currentPlayer)}
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

      {game && user?.connected && (
        <Modal
          open={modelOpen}
          onClose={handleModalClose}
          center
          classNames={{ modal: 'freq-model-reset-sm' }}
        >
          <PlayerOptions
            player={game.currentPlayer}
            colorMode={colorMode}
            onDebugToggle={handleDebugToggle}
            onColorModeToggle={handleToggleColorMode}
            onLogout={handleLogout}
            onClose={handleModalClose}
          />
        </Modal>
      )}

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
          background: var(--translucent-inverse-2);
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
          height: 100%;
          width: 100%;
          overflow: auto;
          padding-top: 3em;
        }

        .show-debug .body {
          padding-top: 5em;
        }
      `}</style>
    </div>
  )
}

Container.defaultProps = defaultProps

export default Container
