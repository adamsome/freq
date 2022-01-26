import produce from 'immer'
import { useState } from 'react'
import {
  BlowAction,
  BlowRoleActionID,
  isBlowRoleActionID,
} from '../../lib/types/blow.types'
import { Command, CommandError } from '../../lib/types/game.types'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import BlowCard, { BlowCardProps } from './blow-card'

type Props = Omit<BlowCardProps, 'theme' | 'onActionClick'> & {
  onCommandError?: (error: CommandError) => void
}

export default function BlowCardContainer({ onCommandError, ...props }: Props) {
  const { game, mutate } = useBlowGame()
  const [fetching, setFetching] = useState<BlowRoleActionID | null>(null)
  const { id: rid } = props
  const fetchingAction =
    fetching ?? (isBlowRoleActionID(game?.fetching) ? game?.fetching : null)

  const handleActionClick = async (xid: BlowRoleActionID): Promise<void> => {
    if (fetching != null || !game || !rid) return

    setFetching(xid)

    try {
      const action: BlowAction = { type: xid, payload: { role: rid } }
      await postCommand(game.type, game.room, 'action', action)
      mutate(
        produce((game) => {
          if (game) game.fetching = xid
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting command action ${xid}.`, data)
      const command: Command = { type: 'action', text: xid }
      onCommandError?.({ command, data, message, date: new Date() })
    }
    setFetching(null)
  }

  return (
    <BlowCard
      {...props}
      theme={game?.settings.theme}
      fetching={fetchingAction}
      onActionClick={handleActionClick}
    />
  )
}
