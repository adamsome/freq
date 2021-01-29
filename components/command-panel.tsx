import { useState } from 'react'
import useGame from '../hooks/use-game'
import { Command } from '../types/game.types'
import { postCommand } from '../util/fetch-json'
import CommandButton from './command-button'

const CommandPanel = () => {
  const [game] = useGame()
  if (!game) return null

  const [error, setError] = useState<string | null>(null)

  const { currentPlayer, commands } = game

  const handleCommandClick = (cmd: Command, i = 0) => async (
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    if (cmd.disabled) return
    if (error) setError(null)
    if (!cmd.type) return
    const value = i > 0 ? cmd.rightValue : cmd.value
    try {
      await postCommand(cmd.type, value)
    } catch (err) {
      console.error(`Error posting command '${cmd.type}'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
    }
  }

  return (
    <div className="wrapper">
      {commands.map((cmd) => (
        <CommandButton
          key={cmd.type + cmd.text + cmd.info + cmd.rightText}
          command={cmd}
          currentPlayer={currentPlayer}
          onClick={handleCommandClick}
        />
      ))}

      {error && <div className="error">{error}</div>}

      <style jsx>{`
        .wrapper {
          width: 100%;
          padding: 0 15px;
        }

        .error {
          font-size: var(--font-size-sm);
          color: brown;
          text-align: center;
          margin-top: var(--stack-sm);
        }
      `}</style>
    </div>
  )
}

export default CommandPanel
