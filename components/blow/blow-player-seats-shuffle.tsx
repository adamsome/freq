import produce from 'immer'
import { MouseEvent, useState } from 'react'
import { Command, CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import Button from '../control/button'
import IconSvg from '../control/icon-svg'

type Props = {
  onCommandError?: (error: CommandError) => void
}

export default function BlowPlayerSeatsShuffle(props: Props) {
  const [shuffling, setShuffling] = useState(false)
  const { game, mutate } = useBlowGame()
  const { players, fetching: gameShuffling } = game ?? {}
  const { onCommandError } = props

  const handleShuffle = async (e: MouseEvent) => {
    e.preventDefault()
    if (shuffling || !game) return

    setShuffling(true)
    try {
      await postCommand(game.type, game.room, 'shuffle_teams')
      mutate(
        produce((game) => {
          if (game) game.fetching = true
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting shuffle command.`, data)
      const command: Command = { type: 'shuffle_teams', text: 'Shuffle' }
      onCommandError?.({ command, data, message, date: new Date() })
    }
    setShuffling(false)
  }

  return (
    <Button
      className={cx('font-spaced-narrow relative h-8 w-24', {
        '-top-6': (players?.length ?? 0) < 4,
        '-top-px': (players?.length ?? 0) >= 4,
      })}
      color="cyan"
      onClick={handleShuffle}
    >
      {shuffling || gameShuffling ? (
        <IconSvg
          name="spinner"
          className="m-auto h-5 w-5 text-black dark:text-white"
        />
      ) : (
        <span className="-mr-[0.2em]">Shuffle</span>
      )}
    </Button>
  )
}
