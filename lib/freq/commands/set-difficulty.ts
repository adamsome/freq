import { CurrentFreqGameView, FreqGame } from '../../../types/freq.types'
import { Dict } from '../../../types/object.types'
import { connectToDatabase } from '../../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function setDifficulty(
  game: CurrentFreqGameView,
  value: unknown
) {
  if (!value) {
    const msg = "Command 'set-difficulty' requires value."
    throw new TypeError(msg)
  }

  if (game.phase !== 'prep')
    throw new Error('Can only change difficulty during prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<FreqGame> & Dict<any> = {
    ['settings.difficulty']: value,
  }

  await fromGames(db).updateOne(filter, { $set: changes })
}
