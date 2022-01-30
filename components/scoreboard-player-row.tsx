import type { ReactNode } from 'react'
import { Player } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'

type Props = typeof defaultProps & {
  children: ReactNode
  player: Player
  onClick?: () => void
}

const defaultProps = {
  right: false,
  active: false,
  current: false,
  leader: false,
  readonly: false,
}

export default function ScoreboardPlayerRow({
  children,
  player,
  right,
  active,
  current,
  leader,
  readonly,
  onClick,
}: Props) {
  return (
    <div
      className={cx(
        `flex items-center justify-between
        overflow-hidden whitespace-nowrap
        py-1
        text-base
        text-black
        transition-colors
        dark:text-white
        sm:text-lg`,
        {
          'ml-0 mr-1 flex-row pl-2 pr-3': !right,
          'ml-1 mr-0 flex-row-reverse pl-3 pr-2': right,
          'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900':
            !readonly && leader,
        }
      )}
      style={styleColor(player.color, active ? 1 : current ? 0.25 : 0)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

ScoreboardPlayerRow.defaultProps = defaultProps
