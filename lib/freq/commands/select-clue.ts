import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function selectClue(
  game: CurrentFreqGameView,
  clueIndex: unknown
) {
  if (game.psychic !== game.currentPlayer.id)
    throw new Error('Only psychic can select clue.')

  if (game.phase !== 'choose')
    throw new Error('Can only confirm clue in the choose phase.')

  if (typeof clueIndex !== 'number')
    throw new TypeError("Command 'select_clue' requires numeric 'clueIndex'.")

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentFreqGameView> = { clue_selected: clueIndex }

  await fromGames(db).updateOne(filter, { $set: changes })
}
