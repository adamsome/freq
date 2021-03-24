import { CurrentFreqGameView } from '../../../types/freq.types'
import { connectToDatabase } from '../../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function (game: CurrentFreqGameView) {
  if (game.currentPlayer.id !== game.psychic)
    throw new Error('Only psychic can confirm clue.')

  if (game.phase !== 'choose')
    throw new Error('Can only confirm clue in the choose phase.')

  if (game.clue_selected == null)
    throw new Error('A clue must be selected to confirm.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentFreqGameView> = { phase: 'guess' }

  await fromGames(db).updateOne(filter, { $set: changes })
}
