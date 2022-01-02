import type { ReactNode } from 'react'
import { Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'

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
        'flex justify-between items-center transition-colors',
        'py-1 overflow-hidden whitespace-nowrap',
        'text-black dark:text-white text-base sm:text-lg',
        {
          'flex-row pl-2 pr-3 ml-0 mr-1': !right,
          'flex-row-reverse pl-3 pr-2 ml-1 mr-0': right,
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
