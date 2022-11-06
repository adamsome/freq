import { findCurrentPlayer, isPlayer } from '../../player'
import { ResGame } from '../../types/res.types'
import { fromUsers } from '../../user-store'
import { connectToDatabase } from '../../util/mongodb'
import { fromResGames } from '../res-game-store'

export default async function editPlayer(
  game: ResGame,
  userID: string,
  player: unknown
) {
  if (!isPlayer(player))
    throw new TypeError("Command 'edit_player' requires valid 'player'.")

  const currentPlayer = findCurrentPlayer(game.players, userID)

  if (!currentPlayer)
    throw new Error('Players can only edit player when logged in.')

  if (currentPlayer?.id !== player.id)
    throw new Error('Players can only change their own name.')

  const index = game.players.findIndex((p) => p.id === player.id)
  if (index < 0)
    throw new Error('Cannot change player team when player index not found.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes = { name: player.name, icon: player.icon }
  const nextPlayer = { ...currentPlayer, ...changes }

  await fromResGames(db).updateOne(filter, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $set: { [`players.${index}`]: nextPlayer } as any,
  })
  await fromUsers(db).updateOne({ id: player.id }, { $set: changes })
}
