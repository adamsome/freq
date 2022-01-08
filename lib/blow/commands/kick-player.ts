import { findCurrentPlayer, isPlayer } from '../../player'
import { BlowGame } from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames, leaveBlowGame } from '../blow-game-store'

export default async function kickPlayer(
  game: BlowGame,
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

  await leaveBlowGame(game.room, player.id)

  await fromBlowGames(db).updateOne(filter, {
    $set: {
      [`kicked.${player.id}`]: true,
    },
  })
}
