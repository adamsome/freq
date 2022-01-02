import { FullCwdGameView } from '../../types/cwd.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromCwdGames } from '../cwd-game-store'
import { createPrepCwdMatchChanges } from '../prep-cwd-match'

export default async function prepNewMatch(game: FullCwdGameView) {
  if (!game.currentPlayer.leader && !game.currentPlayer.designatedPsychic)
    throw new Error('Only leaders can start new match')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<FullCwdGameView> = createPrepCwdMatchChanges(game)

  await fromCwdGames(db).updateOne(filter, { $set: changes })
}
