import { useState } from 'react'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { ButtonProps } from '../control/button'
import DebugBar from '../debug/debug-bar'
import HeaderActions from './header-actions'
import HeaderTitle from './header-title'

type Props = {
  type?: GameType
  big?: boolean
  button?: Partial<ButtonProps>
  sticky?: boolean
  onLogoClick?: () => void
  onTitleClick?: () => void
}

export default function Header({
  type,
  big,
  button = {},
  sticky,
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
      className={cx(`
        ${sticky ? 'sticky' : 'fixed'}
        flex-center left-0 top-0 z-30 w-full flex-col
        border-b
        border-gray-200
        bg-white/80
        backdrop-blur-[10px]
        dark:border-gray-900
        dark:bg-black/80
        ${heightClass}
      `)}
    >
      {showDebug && <DebugBar />}

      <div className="flex-center h-12 w-full pl-2 pr-2 sm:pl-4 sm:pr-4">
        <HeaderTitle
          type={type}
          big={big}
          onLogoClick={onLogoClick}
          onTitleClick={onTitleClick}
        />

        <HeaderActions
          button={button}
          onDebugToggle={() => setShowDebug(!showDebug)}
        />
      </div>
    </header>
  )
}
