import useGame from '../hooks/use-game'
import { Command } from '../types/game.types'
import { cx } from '../util/dom'
import { colorPlayer } from '../util/dom-style'

const CommandPanel = () => {
  const [game] = useGame()
  if (!game) return null

  const { currentPlayer, commands, commandInfo } = game

  const handleCommandClick = (cmd: Command) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (cmd.waiting) return
    // eslint-disable-next-line no-console
    console.log('cmd', cmd)
  }

  return (
    <div className="wrapper">
      <div className="info">{commandInfo}</div>
      {commands.map((a, i) => (
        <button
          key={i}
          className={cx('cmd', a.waiting && 'waiting')}
          style={colorPlayer(!a.waiting && currentPlayer, true)}
          disabled={a.waiting}
          onClick={handleCommandClick(a)}
        >
          {a.text}
        </button>
      ))}

      <style jsx>{`
        .wrapper {
          width: 100%;
        }

        .cmd {
          background: var(--translucent);
          border-radius: var(--border-radius-md);
          width: 100%;
          padding-top: var(--stack-sm);
          padding-bottom: var(--stack-sm);
          border: 1px solid transparent;
        }

        .cmd:focus,
        .cmd:hover {
          border: 1px solid var(--body);
        }

        .cmd.waiting {
          background: var(--translucent);
          color: var(--hint);
        }

        .cmd.waiting:focus,
        .cmd.waiting:hover {
          border: 1px solid transparent;
        }
      `}</style>
    </div>
  )
}

export default CommandPanel
