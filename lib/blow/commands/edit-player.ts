import { findCurrentPlayer, isPlayer, parsePlayerEdit } from '../../player'
import { BlowGame } from '../../types/blow.types'
import { fromUsers } from '../../user-store'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames } from '../blow-game-store'

export default async function editPlayer(
  game: BlowGame,
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

  const changes = parsePlayerEdit(player)
  const nextPlayer = { ...currentPlayer, ...changes }

  await fromBlowGames(db).updateOne(filter, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $set: { [`players.${index}`]: nextPlayer } as any,
  })
  await fromUsers(db).updateOne({ id: currentPlayer.id }, { $set: changes })
}
