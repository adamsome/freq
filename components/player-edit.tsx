import produce from 'immer'
import type { MouseEvent } from 'react'
import { useRef, useState } from 'react'
import iconSet from '../lib/icon'
import { CommandType } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import { postCommand } from '../lib/util/fetch-json'
import useGame from '../lib/util/use-game'
import useLayoutEffect from '../lib/util/use-passive-layout-effect'
import IconSvg from './control/icon-svg'
import PlayerOptionButton from './player-option-button'

type Props = typeof defaultProps & {
  onClose?: () => void
}

const defaultProps = {}

const PlayerEdit = ({ onClose }: Props) => {
  const { game, mutate } = useGame()
  const player = game?.currentPlayer

  const inputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    inputRef.current?.select()
  }, [])

  const [fetching, setFetching] = useState(false)
  const [icon, setIcon] = useState(player?.icon ?? '')
  const [name, setName] = useState(player?.name ?? '')

  const handleSave = async (e: MouseEvent) => {
    e.preventDefault()
    if (name.length < 2 || fetching || player?.fetching || !game) return

    setFetching(true)
    const cmd: CommandType = 'edit_player'
    try {
      await postCommand(game.type, game.room, cmd, { ...player, name, icon })
      mutate(
        produce((game) => {
          if (game && game.currentPlayer) {
            game.currentPlayer.fetching = true
          }
        }, game)
      )
    } catch (err) {
      console.error(`Error posting command '${cmd}'.`, err.data ?? err)
    }
    setFetching(false)
    onClose?.()
  }

  if (!game || !player) return null

  return (
    <>
      <h2
        className={cx(`
          bg-gray-400
          text-3xl font-semibold text-white
          dark:bg-gray-700
        `)}
        style={styleColor(player, 1)}
      >
        <input
          className={cx(`
            w-full bg-transparent px-12 py-2 font-semibold focus:outline-none
          `)}
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value.substr(0, 16))}
        />
        <div className="absolute top-2 left-2.5">{icon}</div>
      </h2>

      <div className="flex-start max-h-[28rem] w-full flex-col overflow-hidden p-0">
        <div className="flex-center flex-1 flex-wrap overflow-auto pt-2">
          {iconSet.map((i) => (
            <div
              key={i}
              className={cx(`
                flex-center
                h-11
                cursor-pointer
                rounded-lg border border-transparent
                px-1.5
                align-middle text-3xl
                transition-colors
                hover:border-blue-700
                hover:bg-gray-200
                dark:hover:bg-black
                ${i === icon ? 'bg-gray-200 dark:bg-black' : ''}
              `)}
              onClick={() => setIcon(i)}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <PlayerOptionButton
        noDivider
        className={cx(`
          inline-flex items-center
          bg-blue-700 text-2xl text-white
          hover:bg-blue-900 dark:hover:bg-blue-600
        `)}
        disabled={fetching || player.fetching}
        onClick={handleSave}
      >
        Save
        {(fetching || player.fetching) && (
          <IconSvg name="spinner" className="ml-3 h-5 w-5 text-white" />
        )}
      </PlayerOptionButton>
    </>
  )
}

PlayerEdit.defaultProps = defaultProps

export default PlayerEdit
