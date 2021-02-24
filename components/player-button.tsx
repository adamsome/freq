import React from 'react'
import { Player } from '../types/game.types'
import { User } from '../types/user.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import IconSvg from './icon-svg'

type Props = typeof defaultProps & {
  user?: User
  player?: Player
  onClick: (e: React.MouseEvent) => void
}

const defaultProps = {
  size: 'md' as 'md' | 'xl',
}

const PlayerButton = ({ user, player, size, onClick }: Props) => {
  return (
    <button
      className={cx('icon', size)}
      style={styleColor(player)}
      onClick={onClick}
    >
      {player?.icon ?? user?.icon ?? '🤠'}&nbsp;&nbsp;
      {player?.name ?? user?.name ?? 'Noname'}
      <div>
        <IconSvg name="dropdown" />
      </div>
      <style jsx>{`
        button {
          display: flex;
          align-items: center;
          padding: 0 0 0 var(--inset-xs);
          font-size: var(--font-size-lg);
        }

        button.xl {
          font-size: var(--font-size-xl);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-md);
          padding: 6px 2px 4px 14px;
        }

        button:hover {
          background: var(--bg-1);
        }

        button div {
          top: 2px;
          position: relative;
        }

        button.xl div {
          top: 0px;
        }

        @media screen and (max-width: 480px) {
          button.icon {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </button>
  )
}

PlayerButton.defaultProps = defaultProps

export default PlayerButton
