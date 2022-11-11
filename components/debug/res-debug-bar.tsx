import { ChangeEvent, useEffect, useState } from 'react'
import { API_GAME_JOIN, API_USER_AS_USER } from '../../lib/consts'
import { createMockUser } from '../../lib/mock-users'
import { ResAction, ResGameView } from '../../lib/types/res.types'
import { User } from '../../lib/types/user.types'
import { range } from '../../lib/util/array'
import { postCommand, postJson } from '../../lib/util/fetch-json'
import { useFetchUser } from '../../lib/util/use-fetch-user'
import Button from '../control/button'

type Props = {
  game: ResGameView
}

export default function ResDebugBar({ game }: Props) {
  const [asUser, setAsUser] = useState<string | null>(null)
  const { user } = useFetchUser()

  useEffect(() => {
    setAsUser(user?.as_user ?? null)
  }, [user])

  const handleAddTestUsers = async (e: React.MouseEvent) => {
    e.preventDefault()
    const room = game.room
    const path = API_GAME_JOIN.replace('%0', game.type).replace('%1', room)
    const users: User[] = range(0, 4).map((i) => createMockUser(i, { room }))
    await postJson(path, { users })
  }

  const handleAsUserChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value === '__none__' ? null : e.target.value
    await postJson(API_USER_AS_USER, { asUser: id })
    setAsUser(id)
  }

  const handleNextUser = async (offset: number) => {
    let userID = asUser ?? game.currentPlayer?.id
    if (!userID) return
    let playerIndex = game.players.findIndex((p) => p.id === userID)
    let orderIndex = game.player_order.findIndex((i) => i === playerIndex)
    if (orderIndex < 0) return
    orderIndex += offset
    const playerCount = game.player_order.length
    if (orderIndex < 0) orderIndex = playerCount + (orderIndex % playerCount)
    playerIndex = game.player_order[orderIndex % playerCount]
    userID = game.players[playerIndex]?.id
    if (!userID) return
    await postJson(API_USER_AS_USER, { asUser: userID })
    setAsUser(userID)
  }

  const handleBulkVotes = async (e: React.MouseEvent, vote: boolean) => {
    e.preventDefault()
    const action: ResAction = { type: 'vote_team', payload: vote }
    await Promise.all(
      game.players.map(async (p) => {
        const asUser = p.id
        await postCommand(game.type, game.room, 'action', action, { asUser })
      })
    )
  }

  // TODO: Add a user left/right switcher (in player_order)
  return (
    <div className="flex-center h-6 space-x-4 pt-2">
      <div>
        <label htmlFor="as-users" className="mx-1 font-semibold">
          Users
        </label>
        <Button spacing="p-1" className="mx-1" onClick={handleAddTestUsers}>
          Mock
        </Button>

        <label htmlFor="as-users" className="mx-1">
          As
        </label>
        <Button spacing="p-1" onClick={() => handleNextUser(-1)}>
          &lt;
        </Button>
        <select
          id="as-users"
          className="text-blue-600 dark:bg-black dark:text-blue-600"
          value={asUser ?? '__none__'}
          onChange={(e) => handleAsUserChange(e)}
        >
          <option value="__none__">None</option>
          {game.players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button spacing="p-1" onClick={() => handleNextUser(1)}>
          &gt;
        </Button>
      </div>

      <div>
        <label className="mx-1 font-semibold">Votes</label>
        <Button spacing="p-1" onClick={(e) => handleBulkVotes(e, false)}>
          Reject
        </Button>
        <Button spacing="px-1" onClick={(e) => handleBulkVotes(e, true)}>
          Approve
        </Button>
      </div>
    </div>
  )
}
