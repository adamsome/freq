import { CurrentGameView } from '../../types/game.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../game-store'

export default async function (game: CurrentGameView) {
  if (game.currentPlayer.id !== game.psychic)
    throw new Error('Only psychic can confirm clue.')

  if (game.phase !== 'choose')
    throw new Error('Can only confirm clue in the choose phase.')

  if (game.clue_selected == null)
    throw new Error('A clue must be selected to confirm.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentGameView> = { phase: 'guess' }

  await fromGames(db).updateOne(filter, { $set: changes })
}
