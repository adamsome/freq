import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames, leaveGame } from '../game-store'
import { isPlayer } from '../player'

export default async function (game: CurrentGameView, player: unknown) {
  if (!isPlayer(player)) {
    const msg = "Command 'kick-player' requires valid 'player'."
    throw new TypeError(msg)
  }

  if (!game.currentPlayer.leader)
    throw new Error('Only leaders can kick players.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await leaveGame(game.room, player.id)

  await fromGames(db).updateOne(filter, {
    $set: {
      [`kicked.${player.id}`]: true,
    },
  })
}
