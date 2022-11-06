import { findCurrentPlayer } from '../../player'
import { ResGame } from '../../types/res.types'
import { shiftOrder } from '../../util/array'
import { connectToDatabase } from '../../util/mongodb'
import { fromResGames } from '../res-game-store'

export default async function prepNewMatch(
  game: ResGame,
  userID: string,
  startPlayerIndex?: unknown
) {
  const currentPlayer = findCurrentPlayer(game.players, userID)

  if (!currentPlayer?.leader)
    throw new Error('Only leaders can start new match')

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
    player_order,
  }

  await fromResGames(db).updateOne(filter, { $set: changes })
}
