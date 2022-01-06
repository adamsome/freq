import produce from 'immer'
import { useState } from 'react'
import { Command } from '../lib/types/game.types'
import { postCommand } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import CommandButton from './command-button'
import { ButtonProps } from './control/button'

type Props = {
  button?: Partial<ButtonProps>
}

const CommandPanel = ({ button = {} }: Props) => {
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
      console.error(`Error posting command '${cmd.type}'.`, err.data ?? err)
      setError(String(err?.data?.message ?? err?.message))
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
            onClick={(event, cmd, colIndex) =>
              handleCommandClick(event, cmd, rowIndex, colIndex)
            }
          />
        </div>
      ))}

      {error && <div className="text-red-700 text-center mt-2">{error}</div>}
    </div>
  )
}

export default CommandPanel
