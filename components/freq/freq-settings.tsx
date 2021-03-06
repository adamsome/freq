import produce from 'immer'
import React, { useState } from 'react'
import { useFreqGame } from '../../hooks/use-game'
import {
  freqClueDifficulties,
  FreqClueDifficultyOrAll,
  FreqGameView,
} from '../../types/freq.types'
import { CommandType } from '../../types/game.types'
import { cx } from '../../util/dom'
import { postCommand } from '../../util/fetch-json'
import ActionModal from '../action-modal'
import ActionModalOptions from '../action-modal-options'
import Button from '../button'
import ButtonGroup from '../button-group'
import IconSvg from '../icon-svg'
import PlayerOptionButton from '../player-option-button'
import Setting from '../setting'

type Props = typeof defaultProps

const defaultProps = {}

export default function FreqSettings(_: Props) {
  const { game, mutate } = useFreqGame()
  const [open, setOpen] = useState(false)
  const [fetching, setFetching] = useState(false)

  if (!game) return null

  const disabled = fetching || game?.fetching
  const designatedPsychic = game.settings?.designated_psychic === true
  const difficulty: FreqClueDifficultyOrAll = game.settings?.difficulty ?? 'all'
  let difficultyIndex = freqClueDifficulties.indexOf(difficulty)
  if (difficultyIndex === -1) difficultyIndex = freqClueDifficulties.length

  const handleCommand = async (cmd: CommandType, value?: unknown) => {
    if (!game || fetching || game.fetching) return

    setFetching(true)
    try {
      await postCommand(game.type, game.room, cmd, value)
      mutate(
        produce((game?: FreqGameView) => {
          if (game) game.fetching = true
        })
      )
    } catch (err) {
      console.error('Error setting designated psychic.', err.data ?? err)
    }
    setFetching(false)
  }

  return (
    <>
      <div className="mb-6">
        <Button className="text-xl" onClick={() => setOpen(true)}>
          Change Room Settings
        </Button>
      </div>

      <ActionModal open={open} onClose={() => setOpen(false)}>
        <h2
          className={cx(
            'bg-gray-400 dark:bg-gray-700',
            'text-3xl text-white font-semibold',
            'm-0 px-4 py-2'
          )}
        >
          Room Settings
        </h2>

        <ActionModalOptions>
          <Setting
            label="Designated Psychic"
            onLabelClick={() =>
              handleCommand('set_designated_psychic_mode', !designatedPsychic)
            }
          >
            <ButtonGroup
              buttons={['Off', 'On']}
              selected={designatedPsychic ? 1 : 0}
              disabled={disabled}
              width={14}
              onClick={(_, i) =>
                handleCommand('set_designated_psychic_mode', i === 1)
              }
            />
          </Setting>

          <Setting label="Difficulty">
            <ButtonGroup
              buttons={['Easy', 'Hard', 'All']}
              selected={difficultyIndex}
              disabled={disabled}
              width={16}
              onClick={(_, i) =>
                handleCommand(
                  'set_difficulty',
                  freqClueDifficulties[i] ?? 'all'
                )
              }
            />
          </Setting>

          <PlayerOptionButton
            close
            disabled={disabled}
            className="inline-flex items-center"
            onClick={() => setOpen(false)}
          >
            {disabled ? 'Processing' : 'Close'}
            {disabled && (
              <IconSvg name="spinner" className="w-5 h-5 ml-3 text-white" />
            )}
          </PlayerOptionButton>
        </ActionModalOptions>
      </ActionModal>
    </>
  )
}

FreqSettings.defaultProps = defaultProps
