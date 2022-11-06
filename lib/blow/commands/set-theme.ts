import { BlowGame, isBlowThemeID } from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames } from '../blow-game-store'

export default async function setTheme(game: BlowGame, value: unknown) {
  if (!value || !isBlowThemeID(value)) {
    const msg = "Command 'set_theme' requires value."
    throw new TypeError(msg)
  }

  if (game.phase !== 'prep')
    throw new Error('Can only change theme during prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes = {
    ['settings.theme']: value,
  }

  await fromBlowGames(db).updateOne(filter, { $set: changes })
}
