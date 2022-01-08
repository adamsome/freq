import { findCurrentPlayer } from '../../player'
import { BlowGame } from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames } from '../blow-game-store'
import { createPrepBlowMatchChanges } from '../prep-blow-match'

export default async function prepNewMatch(game: BlowGame, userID: string) {
  const currentPlayer = findCurrentPlayer(game.players, userID)

  if (!currentPlayer?.leader)
    throw new Error('Only leaders can start new match')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes = createPrepBlowMatchChanges()

  await fromBlowGames(db).updateOne(filter, { $set: changes })
}
