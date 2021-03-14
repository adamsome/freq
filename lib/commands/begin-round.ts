import { CurrentGameView, Game } from '../../types/game.types'
import { connectToDatabase, toMongoUnset } from '../../util/mongodb'
import { randomClues } from '../clue'
import { doesGameHaveEnoughPlayers, getNextPsychic } from '../game'
import { fromGames } from '../game-store'
import { isFreePhase } from '../phase'

export default async function (game: CurrentGameView) {
  if (!isFreePhase(game.phase))
    throw new Error('Can only begin a round from the free phases.')

  if (!doesGameHaveEnoughPlayers(game))
    throw new Error('Must have at least 2 players per team to begin round.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentGameView> = {}
  const deletes: (keyof Game)[] = []

  // Need to pick a the next psychic and set turn to their team
  const psychic = getNextPsychic(game) ?? game.players[0]
  changes.psychic = psychic.id
  changes.team_turn = psychic.team ?? 1

  if (game.phase !== 'reveal') {
    // Reset the psychic counts between matches
    deletes.push('psychic_counts')
    // Reset the scores based on which team is up (0); other team (1)
    changes.score_team_1 = psychic.team === 1 ? 0 : 1
    changes.score_team_2 = psychic.team === 1 ? 1 : 0
    changes.match_number = game.match_number + 1
  }

  deletes.push(
    'repeat_turn',
    'next_psychic',
    'clue_selected',
    'guesses',
    'directions'
  )

  const minWidth = game.target_width / 5 / 2 / 100
  const target = Math.max(minWidth, Math.min(Math.random(), 1 - minWidth))
  changes.target = target
  changes.clues = randomClues()
  changes.round_number = game.round_number + 1
  changes.round_started_at = new Date().toISOString()

  changes.phase = 'choose'

  await fromGames(db).updateOne(filter, {
    $set: changes,
    $unset: toMongoUnset(deletes),
  })

  // Increment the psychic count if we are mid-match
  const nextCount = (game.psychic_counts?.[psychic.id] ?? 0) + 1
  await fromGames(db).updateOne(filter, {
    $set: { [`psychic_counts.${psychic.id}`]: nextCount },
  })
}
