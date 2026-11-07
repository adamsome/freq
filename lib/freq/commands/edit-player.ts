import { parsePlayerEdit } from '../../player'
import { CurrentFreqGameView } from '../../types/freq.types'
import { fromUsers } from '../../user-store'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function editPlayer(
  game: CurrentFreqGameView,
  value: unknown
) {
  // Only the caller can be edited: never trust a player ID from the request.
  const { id } = game.currentPlayer
  const changes = parsePlayerEdit(value)

  const index = game.players.findIndex((p) => p.id === id)
  if (index < 0)
    throw new Error('Cannot change player team when player index not found.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const nextPlayer = { ...game.currentPlayer, ...changes }

  await fromGames(db).updateOne(filter, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $set: { [`players.${index}`]: nextPlayer } as any,
  })
  await fromUsers(db).updateOne({ id }, { $set: changes })
}
