import produce from 'immer'
import { useState } from 'react'
import {
  BlowAction,
  BlowRoleActionID,
  isBlowRoleActionID,
} from '../../lib/types/blow.types'
import { Command, CommandError } from '../../lib/types/game.types'
import { postCommand } from '../../lib/util/fetch-json'
import useGame from '../../lib/util/use-game'
import BlowCard, { BlowCardProps } from './blow-card'

type Props = Omit<BlowCardProps, 'onActionClick'> & {
  onError?: (error: CommandError) => void
}

export default function BlowCardContainer({ onError, ...props }: Props) {
  const { game, mutate } = useGame()
  const [fetching, setFetching] = useState<BlowRoleActionID | null>(null)
  const role = props.id
  const fetchingAction =
    fetching ?? (isBlowRoleActionID(game?.fetching) ? game?.fetching : null)

  const handleActionClick = async (id: BlowRoleActionID): Promise<void> => {
    console.log('action', id)
    if (fetching != null || !game || !role) return
    setFetching(id)

    try {
      const action: BlowAction = { type: id, payload: { role } }
      await postCommand(game.type, game.room, 'action', action)
      mutate(
        produce((game) => {
          if (game) game.fetching = id
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting command action ${id}.`, data)
      const command: Command = { type: 'action', text: id }
      onError?.({ command, data, message, date: new Date() })
    }
    setFetching(null)
  }

  return (
    <BlowCard
      {...props}
      fetching={fetchingAction}
      onActionClick={handleActionClick}
    />
  )
}
