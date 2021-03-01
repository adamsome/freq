import React, { useRef, useState } from 'react'
import useGame from '../hooks/use-game'
import useLayoutEffect from '../hooks/use-passive-layout-effect'
import iconSet from '../lib/icon'
import { CommandType } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'
import { postCommand } from '../util/fetch-json'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  onClose?: () => void
}

const defaultProps = {}

const PlayerEdit = ({ onClose }: Props) => {
  const { game, mutate } = useGame()
  const player = game?.currentPlayer
  if (!game || !player) return null

  const inputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    inputRef.current?.select()
  }, [])

  const [icon, setIcon] = useState(player.icon ?? '')
  const [name, setName] = useState(player.name ?? '')

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (name.length < 2) return
    const cmd: CommandType = 'edit_player'
    try {
      await postCommand(game.room, cmd, { ...player, name, icon })
      mutate()
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    if (onClose) onClose()
  }

  return (
    <>
      <h2
        className={cx(
          'bg-gray-400 dark:bg-gray-700',
          'text-3xl text-white font-semibold'
        )}
        style={styleColor(player, 1)}
      >
        <input
          className={cx(
            'xx w-full px-12 py-2 focus:outline-none',
            'bg-transparent',
            'font-semibold'
          )}
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value.substr(0, 16))}
        />
        <div className="absolute top-2 left-2.5">{icon}</div>
      </h2>

      <div className="flex-start flex-col p-0 w-full h-96 overflow-hidden">
        <div className="flex-1 flex-center flex-wrap pt-2 overflow-auto">
          {iconSet.map((i) => (
            <div
              key={i}
              className={cx(
                'flex-center align-middle transition-colors',
                'text-3xl h-11 px-1.5 cursor-pointer',
                'hover:bg-gray-200 dark:hover:bg-black',
                'border border-transparent',
                'hover:border-blue-700 rounded-lg',
                { 'bg-gray-200 dark:bg-black': i === icon }
              )}
              onClick={() => setIcon(i)}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <PlayerOptionButton
        noDivider
        className="bg-blue-700 hover:bg-blue-900 dark:hover:bg-blue-600 text-white text-2xl"
        onClick={handleSave}
      >
        Save
      </PlayerOptionButton>
    </>
  )
}

PlayerEdit.defaultProps = defaultProps

export default PlayerEdit
