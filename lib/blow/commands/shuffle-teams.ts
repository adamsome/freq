import { BlowGame } from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { shuffle } from '../../util/random'
import { fromBlowGames } from '../blow-game-store'

export default async function shuffleTeams(game: BlowGame) {
  if (game.phase !== 'prep') throw new Error('Can only shuffle teams in prep.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }
  const changes: Partial<BlowGame> = {}

  changes.player_order = shuffle(game.player_order)

  await fromBlowGames(db).updateOne(filter, {
    $set: changes,
  })
}
