import React from 'react'
import { Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import IconSvg from './icon-svg'

type Props = typeof defaultProps & {
  player: Player
  onClick: (e: React.MouseEvent) => void
}

const defaultProps = {
  size: 'md' as 'md' | 'xl',
}

const PlayerButton = ({ player, size, onClick }: Props) => {
  return (
    <button
      className={cx('icon', size)}
      style={styleColor(player)}
      onClick={onClick}
    >
      {player.icon}&nbsp;&nbsp;
      {player.name ?? 'Noname'}
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
        }

        button:hover {
          background: var(--bg-1);
        }

        button div {
          top: 2px;
          position: relative;
        }

        @media screen and (max-width: 480px) {
          button.icon {
            font-size: var(--font-size-md);
          }

          button.xl {
            font-size: var(--font-size-xl);
          }
        }
      `}</style>
    </button>
  )
}

PlayerButton.defaultProps = defaultProps

export default PlayerButton
