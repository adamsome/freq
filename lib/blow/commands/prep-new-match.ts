import { findCurrentPlayer } from '../../player'
import { BlowGame } from '../../types/blow.types'
import { shiftOrder } from '../../util/array'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames } from '../blow-game-store'

export default async function prepNewMatch(
  game: BlowGame,
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

  const changes: Partial<BlowGame> = {
    phase: 'prep' as const,
    actions: [],
    player_order,
  }

  await fromBlowGames(db).updateOne(filter, { $set: changes })
}
