import { BlowGame } from '../../types/blow.types'
import { Dict } from '../../types/object.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames } from '../blow-game-store'

export default async function setTheme(game: BlowGame, value: unknown) {
  if (!value) {
    const msg = "Command 'set_theme' requires value."
    throw new TypeError(msg)
  }

  if (game.phase !== 'prep')
    throw new Error('Can only change theme during prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<BlowGame> & Dict<unknown> = {
    ['settings.theme']: value,
  }

  await fromBlowGames(db).updateOne(filter, { $set: changes })
}
