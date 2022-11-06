import { doesGameHaveEnoughPlayers } from '../../game'
import { ResGame } from '../../types/res.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromResGames } from '../res-game-store'

export default async function beginRound(game: ResGame) {
  if (!doesGameHaveEnoughPlayers(game, 'res'))
    throw new Error('Must have at least 3 players per team to begin round.')

  if (game.phase !== 'prep') throw new Error('Cannot begin round during game.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<ResGame> = {}

  const now = new Date().toISOString()

  // New match, reset round number and increment match number
  changes.round_number = 1
  changes.match_number = game.match_number + 1
  changes.match_started_at = now

  if (game.round_started_at) {
    changes.round_finished_at = now
  }
  changes.round_started_at = now
  changes.phase = 'guess'

  await fromResGames(db).updateOne(filter, { $set: changes })
}
