import { useState } from 'react'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import DebugBar from './debug-bar'
import HeaderActions from './header-actions'
import HeaderTitle from './header-title'

type Props = typeof defaultProps & {
  type?: GameType
  big?: boolean
  onLogoClick?: () => void
  onTitleClick?: () => void
}

const defaultProps = {}

export default function Header({
  type,
  big,
  onLogoClick,
  onTitleClick,
}: Props) {
  const [showDebug, setShowDebug] = useState(false)

  let heightClass = 'h-12'
  if (showDebug) {
    heightClass = big ? 'h-24' : 'h-20'
  } else if (big) {
    heightClass = 'h-16'
  }

  return (
    <header
      className={cx(
        'fixed left-0 top-0 flex-center flex-col',
        'w-full z-30',
        'bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80',
        'backdrop-blur-[10px]',
        'border-b border-gray-200 dark:border-gray-900',
        heightClass
      )}
    >
      {showDebug && <DebugBar />}

      <div className="flex-center w-full h-12 pl-2 sm:pl-4 pr-2 sm:pr-4">
        <HeaderTitle
          type={type}
          big={big}
          onLogoClick={onLogoClick}
          onTitleClick={onTitleClick}
        />

        <HeaderActions onDebugToggle={() => setShowDebug(!showDebug)} />
      </div>
    </header>
  )
}

Header.defaultProps = defaultProps
