import produce from 'immer'
import { useState } from 'react'
import { Command, CommandError } from '../lib/types/game.types'
import { postCommand } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import CommandButton from './command-button'
import { ButtonProps } from './control/button'

type Props = {
  button?: Partial<ButtonProps>
  spacingClassName?: string
  hideError?: boolean
  onError?: (error: CommandError) => void
}

const CommandPanel = ({
  button = {},
  spacingClassName,
  hideError,
  onError,
}: Props) => {
  const { game, mutate } = useGame()

  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  if (!game) return null

  const { currentPlayer, commands } = game

  if (!currentPlayer) return null

  const handleCommandClick = async (
    event: React.MouseEvent,
    cmd: Command,
    rowIndex: number,
    colIndex = 0
  ) => {
    event.preventDefault()

    if (fetching) return

    const isRight = colIndex > 0
    if (isRight) {
      if (cmd.rightDisabled == null) {
        if (cmd.disabled) return
      } else if (cmd.rightDisabled === true) return
    } else if (cmd.disabled) return

    setFetching(true)
    if (error) {
      setError(null)
      setFetching(false)
      return
    }
    if (!cmd.type) {
      setFetching(false)
      return
    }
    const value = isRight ? cmd.rightValue : cmd.value
    const cmdType = isRight ? cmd.rightType ?? cmd.type : cmd.type
    try {
      await postCommand(game.type, game.room, cmdType, value)
      mutate(
        produce((game) => {
          if (game) game.commands[rowIndex].fetching = true
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting command '${cmd.type}'.`, data)
      setError(message)
      onError?.({ command: cmd, data, message, date: new Date() })
    }
    setFetching(false)
  }

  return (
    <div className="w-full px-4 mb-6">
      {commands.map((cmd, rowIndex) => (
        <div
          className="mb-2 last:mb-0"
          key={cmd.type + cmd.text + cmd.info + cmd.rightText}
        >
          <CommandButton
            command={cmd}
            currentPlayer={currentPlayer}
            fetching={fetching}
            button={button}
            rightButton={button}
            spacingClassName={spacingClassName}
            onClick={(event, cmd, colIndex) =>
              handleCommandClick(event, cmd, rowIndex, colIndex)
            }
          />
        </div>
      ))}

      {error && !hideError && (
        <div className="text-red-700 text-center mt-2">{error}</div>
      )}
    </div>
  )
}

export default CommandPanel
