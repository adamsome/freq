import React, { useState } from 'react'
import { GameView } from '../types/game.types'
import DebugBar from './debug-bar'
import HeaderActions from './header-actions'
import HeaderTitle from './header-title'

type Props = typeof defaultProps & {
  game?: GameView
}

const defaultProps = {}

export default function Header({ game }: Props) {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <header>
      {showDebug && <DebugBar game={game} />}

      <div className="wrapper">
        <HeaderTitle game={game} />

        <HeaderActions
          game={game}
          onDebugToggle={() => setShowDebug(!showDebug)}
        />
      </div>

      <style jsx>{`
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
      `}</style>
    </header>
  )
}

Header.defaultProps = defaultProps
