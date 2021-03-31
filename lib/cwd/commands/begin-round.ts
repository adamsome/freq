import { FullCwdGameView } from '../../../types/cwd.types'
import { insertLimited } from '../../../util/array'
import { connectToDatabase } from '../../../util/mongodb'
import { doesGameHaveEnoughPlayers } from '../../game'
import { fromCwdGames } from '../cwd-game-store'

export default async function beginRound(game: FullCwdGameView, auto = false) {
  if (!doesGameHaveEnoughPlayers(game))
    throw new Error('Must have at least 2 players per team to begin round.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<FullCwdGameView> = {}

  const now = new Date().toISOString()

  if (game.phase === 'guess') {
    // New round, increment the round number
    changes.round_number = game.round_number + 1
    // Swap team turn
    changes.team_turn = game.team_turn === 1 ? 2 : 1

    if (!auto) {
      changes.last_act = { at: now, team: game.team_turn, pass: true }
    }
  } else {
    // New match, reset round number and increment match number
    changes.round_number = 1
    changes.match_number = game.match_number + 1
    changes.match_started_at = now
    changes.last_act = undefined

    // Update psychic history
    const history = game.psychic_history
    const psychics = [game.psychic_1, game.psychic_2]
    changes.psychic_history = insertLimited(psychics, history, 16)
  }

  // Reset player guesses and guessing team's guesses
  changes.guesses = {}
  if ((changes.team_turn ?? game.team_turn) === 1) changes.team_1_guesses = []
  if ((changes.team_turn ?? game.team_turn) === 2) changes.team_2_guesses = []

  if (game.round_started_at) {
    changes.round_finished_at = now
  }
  changes.round_started_at = now
  changes.phase = 'guess'

  await fromCwdGames(db).updateOne(filter, { $set: changes })
}
