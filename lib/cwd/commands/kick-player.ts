import { isPlayer } from '../../player'
import { FullCwdGameView } from '../../types/cwd.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromCwdGames, leaveCwdGame } from '../cwd-game-store'

export default async function kickPlayer(
  game: FullCwdGameView,
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

  await leaveCwdGame(game.room, player.id)

  await fromCwdGames(db).updateOne(filter, {
    $set: {
      [`kicked.${player.id}`]: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })
}
