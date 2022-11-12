import { ResGame } from '../../types/res.types'
import { range, shiftOrder } from '../../util/array'
import { connectToDatabase } from '../../util/mongodb'
import { fromResGames } from '../res-game-store'

export default async function prepNewMatch(
  game: ResGame,
  _userID: string,
  startPlayerIndex?: unknown
) {
  if (startPlayerIndex != null && typeof startPlayerIndex !== 'number')
    throw new Error(`'prepNewMatch.startPlayerIndex' must be a number`)

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  let player_order = game.player_order
  if (startPlayerIndex) {
    const i = player_order.findIndex((p) => p === startPlayerIndex)
    if (i >= 0) {
      player_order = shiftOrder(player_order, i)
    }
  }

  const changes: Partial<ResGame> = {
    phase: 'prep' as const,
    step: 'spy_reveal',
    player_order,
    spies: [],
    missions: [
      [
        {
          lead: player_order[0],
          team: [],
          votes: range(game.players.length).map(() => null),
        },
      ],
    ],
  }

  await fromResGames(db).updateOne(filter, { $set: changes })
}
