import { isPlayer } from '../../player'
import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames, leaveFreqGame } from '../freq-game-store'

export default async function kickPlayer(
  game: CurrentFreqGameView,
  player: unknown
) {
  if (!isPlayer(player)) {
    const msg = "Command 'kick-player' requires valid 'player'."
    throw new TypeError(msg)
  }

  if (!game.currentPlayer.leader)
    throw new Error('Only leaders can kick players.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await leaveFreqGame(game.room, player.id)

  await fromGames(db).updateOne(filter, {
    $set: {
      [`kicked.${player.id}`]: true,
    },
  })
}
