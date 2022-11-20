import { isPlayer } from '../../player'
import { CurrentFreqGameView } from '../../types/freq.types'
import { fromUsers } from '../../user-store'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function editPlayer(
  game: CurrentFreqGameView,
  player: unknown
) {
  if (!isPlayer(player))
    throw new TypeError("Command 'edit_player' requires valid 'player'.")

  if (player.id !== player.id)
    throw new Error('Players can only change their own name.')

  const index = game.players.findIndex((p) => p.id === player.id)
  if (index < 0)
    throw new Error('Cannot change player team when player index not found.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes = { name: player.name, icon: player.icon }
  const nextPlayer = { ...game.currentPlayer, ...changes }

  await fromGames(db).updateOne(filter, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $set: { [`players.${index}`]: nextPlayer } as any,
  })
  await fromUsers(db).updateOne({ id: player.id }, { $set: changes })
}
