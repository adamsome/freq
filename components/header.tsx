import React, { useState } from 'react'
import { cx } from '../util/dom'
import DebugBar from './debug-bar'
import HeaderActions from './header-actions'
import HeaderTitle from './header-title'

type Props = typeof defaultProps

const defaultProps = {}

export default function Header(_: Props) {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <header
      className={cx(
        'fixed left-0 top-0 flex-center flex-col',
        'w-full z-30',
        showDebug ? 'h-18' : 'h-12',
        'bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 bg-blur',
        'border-b border-gray-200 dark:border-gray-900'
      )}
    >
      {showDebug && <DebugBar />}

      <div className="flex-center w-full h-12 pl-4 pr-2 sm:pr-4">
        <HeaderTitle />

        <HeaderActions onDebugToggle={() => setShowDebug(!showDebug)} />
      </div>
    </header>
  )
}

Header.defaultProps = defaultProps
