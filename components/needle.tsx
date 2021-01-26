import React from 'react'
import colorDict from '../lib/color-dict'
import { PlayerWithGuess } from '../types/game.types'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  player: PlayerWithGuess
}

const defaultProps = {
  size: 'md' as 'md' | 'lg',
}

const Needle = ({ player, size }: Props) => {
  const { color = 'yellow', icon = '😃' } = player
  const hex = colorDict[color]?.hex
  return (
    <div className={cx('wrapper', size)}>
      <div className="needle" style={{ background: hex }}></div>
      <div className="base" style={{ background: hex }}>
        <span>{icon}</span>
      </div>
      <div className="connector" style={{ background: hex }}></div>

      <style jsx>{`
        .wrapper {
          width: 24px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wrapper.lg {
          width: 32px;
        }

        .needle {
          width: 2px;
          height: calc(100% - 14px);
          background: #000000;
          box-shadow: 0 0 0 1px #00000066;
          border-radius: 4px;
        }

        .lg .needle {
          width: 4px;
          height: calc(100% - 2px);
        }

        .base {
          position: absolute;
          bottom: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          background: #000000;
          color: var(--body-inverse);
          font-size: var(--font-size-md);
          box-shadow: 0 0 0 1px #00000077;
          border-radius: 400px;
        }

        .lg .base {
          bottom: 0;
          width: 32px;
          height: 32px;
          font-size: var(--font-size-lg);
        }

        .connector {
          position: absolute;
          bottom: 31px;
          width: 2px;
          height: 2px;
          background: #000000;
        }

        .lg .connector {
          width: 4px;
          height: 4px;
        }

        .wrapper,
        .wrapper > * {
          user-select: none;
        }
      `}</style>
    </div>
  )
}

Needle.defaultProps = defaultProps

export default Needle
