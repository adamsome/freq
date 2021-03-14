import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../game-store'

export default async function (game: CurrentGameView) {
  if (!game.currentPlayer.leader)
    throw new Error('Only leaders can start new match')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentGameView> = {
    score_team_1: 0,
    score_team_2: 0,
    stats: {},
    phase: 'prep',
  }

  await fromGames(db).updateOne(filter, { $set: changes })
}
