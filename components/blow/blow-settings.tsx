import produce from 'immer'
import { useState } from 'react'
import { BLOW_THEME_IDS } from '../../lib/types/blow.types'
import { CommandType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import ActionModalOptions from '../control/action-modal-options'
import ButtonGroup from '../control/button-group'
import IconSvg from '../control/icon-svg'
import Setting from '../control/setting'
import PlayerOptionButton from '../player-option-button'

type Props = {
  onClose: () => void
}

export default function BlowSettings({ onClose }: Props) {
  const { game, mutate } = useBlowGame()
  const [fetching, setFetching] = useState(false)

  if (!game) return null

  const disabled = fetching || game?.fetching != null
  const theme = game.settings?.theme ?? 'magic'
  const themeIndex = BLOW_THEME_IDS.indexOf(theme)

  const handleCommand = async (cmd: CommandType, value?: boolean | string) => {
    if (!game || fetching || game.fetching) return

    setFetching(true)
    try {
      await postCommand(game.type, game.room, cmd, value)
      mutate(
        produce((game) => {
          if (game) game.fetching = true
        }, game)
      )
    } catch (err) {
      console.error('Error changing room settings.', err.data ?? err)
    }
    setFetching(false)
  }

  return (
    <>
      <h2
        className={cx(`
            m-0
            bg-gray-400
            px-4 py-2
            text-3xl font-semibold text-white dark:bg-gray-700
          `)}
      >
        Room Settings
      </h2>

      <ActionModalOptions>
        <Setting label="Theme">
          <ButtonGroup
            buttons={['Magic', 'Classic']}
            selected={themeIndex}
            disabled={disabled}
            width={16}
            onClick={(_, i) =>
              handleCommand('set_theme', BLOW_THEME_IDS[i] ?? 'magic')
            }
          />
        </Setting>

        <PlayerOptionButton
          close
          disabled={disabled}
          className="inline-flex items-center"
          onClick={onClose}
        >
          {disabled ? 'Processing' : 'Close'}
          {disabled && (
            <IconSvg name="spinner" className="ml-3 h-5 w-5 text-white" />
          )}
        </PlayerOptionButton>
      </ActionModalOptions>
    </>
  )
}
