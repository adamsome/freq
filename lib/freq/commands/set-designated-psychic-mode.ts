import { CurrentFreqGameView, FreqGame } from '../../types/freq.types'
import { Dict } from '../../types/object.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'

export default async function setDesignatedPsychicMode(
  game: CurrentFreqGameView,
  value: unknown
) {
  if (typeof value !== 'boolean') {
    const msg = "Command 'set-designated-psychic-mode' requires boolean value."
    throw new TypeError(msg)
  }

  if (game.phase !== 'prep')
    throw new Error('Can only change designated psychic mode during prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<FreqGame> & Dict<unknown> = {
    ['settings.designated_psychic']: value,
  }

  await fromGames(db).updateOne(filter, { $set: changes })
}
