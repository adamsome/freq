import React from 'react'
import { Command, Player } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'

type Props = typeof defaultProps & {
  command: Command
  currentPlayer: Player
  onClick: (cmd: Command, i?: number) => (e: React.MouseEvent) => Promise<void>
}

const defaultProps = {}

const CommandButton = ({ command: cmd, currentPlayer, onClick }: Props) => {
  const getCmdRightWidth = (cmd: Command) => {
    const w = (cmd.rightWidth ?? 0.5) * 100
    const min = '6.25em'
    const rawWidth = `calc(${w}% - calc(var(--inset-sm) / 2))`
    return `max(${min}, min(${rawWidth}, calc(100% - ${min})))`
  }

  return (
    <>
      <div
        key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        className={cx('inline', cmd.rightText && 'multi')}
      >
        <button
          className="cmd"
          style={styleColor(!cmd.disabled && currentPlayer, true)}
          disabled={cmd.disabled}
          onClick={onClick(cmd)}
        >
          {cmd.text}
        </button>

        {cmd.rightText != null && (
          <button
            className="cmd cmd-2"
            style={{
              ...styleColor(!cmd.disabled && currentPlayer, true),
              flex: `0 0 ${getCmdRightWidth(cmd)}`,
            }}
            disabled={cmd.disabled}
            onClick={onClick(cmd, 1)}
          >
            {cmd.rightText}
          </button>
        )}
      </div>

      {cmd.info && (
        <div className="info" style={styleColor(cmd.infoColor)}>
          {cmd.info}
        </div>
      )}

      <style jsx>{`
        .inline {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .inline > * {
          flex: 1;
        }

        .info {
          text-align: center;
          color: var(--subtle);
          line-height: 18px;
          margin-top: var(--stack-xs);
        }

        .cmd {
          background: var(--translucent);
          border-radius: var(--border-radius-md);
          width: 100%;
          padding-top: var(--stack-sm);
          padding-bottom: var(--stack-sm);
          border: 1px solid transparent;
          font-size: var(--font-size-lg);
        }

        .cmd:focus,
        .cmd:hover {
          border: 1px solid var(--body);
        }

        .cmd:disabled {
          background: var(--translucent);
          color: var(--hint);
        }

        .cmd:disabled:focus,
        .cmd:disabled:hover {
          border: 1px solid transparent;
        }

        .cmd-2 {
          margin-left: var(--inset-sm);
        }

        @media screen and (max-width: 480px) {
          .info {
            font-size: var(--font-size-sm);
          }

          .inline.multi button {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </>
  )
}

CommandButton.defaultProps = defaultProps

export default CommandButton
