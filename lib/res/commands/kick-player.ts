import { findCurrentPlayer, isPlayer } from '../../player'
import { ResGame } from '../../types/res.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromResGames, leaveResGame } from '../res-game-store'

export default async function kickPlayer(
  game: ResGame,
  userID: string,
  player: unknown
) {
  if (!isPlayer(player)) {
    const msg = "Command 'kick-player' requires valid 'player'."
    throw new TypeError(msg)
  }

  const currentPlayer = findCurrentPlayer(game.players, userID)

  if (!currentPlayer?.leader) throw new Error('Only leaders can kick players.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await leaveResGame(game.room, player.id)

  await fromResGames(db).updateOne(filter, {
    $set: {
      [`kicked.${player.id}`]: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })
}
