import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../game-store'

export default async function (game: CurrentGameView) {
  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  await fromGames(db).updateOne(filter, {
    $set: {
      phase: 'win',
      game_finished_at: new Date().toISOString(),
    },
  })
}
