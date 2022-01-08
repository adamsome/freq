import { doesGameHaveEnoughPlayers } from '../../game'
import { BlowGame } from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromBlowGames } from '../blow-game-store'
import { deal, shuffle } from '../store/blow-reducer'

export default async function beginRound(game: BlowGame) {
  if (!doesGameHaveEnoughPlayers(game, 'blow'))
    throw new Error('Must have at least 3 players per team to begin round.')

  if (game.phase !== 'prep') throw new Error('Cannot begin round during game.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<BlowGame> = {}

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

  changes.actions = [...game.actions, shuffle(), deal()]

  await fromBlowGames(db).updateOne(filter, { $set: changes })
}
