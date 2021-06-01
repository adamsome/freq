import { CurrentFreqGameView } from '../../../types/freq.types'
import { connectToDatabase } from '../../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function (game: CurrentFreqGameView) {
  if (!game.currentPlayer.leader && !game.currentPlayer.designatedPsychic)
    throw new Error('Only leaders can start new match')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentFreqGameView> = {
    score_team_1: 0,
    score_team_2: 0,
    phase: 'prep',
  }

  await fromGames(db).updateOne(filter, { $set: changes })
}
