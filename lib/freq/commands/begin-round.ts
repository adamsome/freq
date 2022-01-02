import { doesGameHaveEnoughPlayers } from '../../game'
import { isFreePhase } from '../../phase'
import { CurrentFreqGameView, FreqGame } from '../../types/freq.types'
import { insertLimited } from '../../util/array'
import { connectToDatabase, toMongoUnset } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'
import { getNextPsychic } from '../freq-psychic'
import randomFreqCluePair from '../random-freq-clue-pair'

export default async function beginRound(game: CurrentFreqGameView) {
  if (!isFreePhase(game.phase))
    throw new Error('Can only begin a round from the free phases.')

  if (!doesGameHaveEnoughPlayers(game, 'freq'))
    throw new Error('Must have at least 2 players per team to begin round.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentFreqGameView> = {}
  const deletes: (keyof FreqGame)[] = []

  const now = new Date().toISOString()

  // Need to pick a the next psychic and set turn to their team
  if (!game.settings?.designated_psychic) {
    const lastPsychic = game.psychic
    const { psychic = game.players[0], psychic_history } = getNextPsychic(game)
    changes.psychic = psychic.id
    changes.psychic_history = insertLimited(lastPsychic, psychic_history, 16)
    changes.team_turn = psychic.team ?? 1
  } else {
    changes.team_turn = game.team_turn === 1 ? 2 : 1
  }

  if (game.phase !== 'reveal') {
    // New Match
    // Reset the psychic counts between matches
    deletes.push('psychic_counts')
    // Reset the scores based on which team is up (0); other team (1)
    changes.score_team_1 = changes.team_turn === 1 ? 0 : 1
    changes.score_team_2 = changes.team_turn === 1 ? 1 : 0
    changes.match_number = game.match_number + 1
    changes.match_started_at = now
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

  const { pair, index } = randomFreqCluePair({
    difficulty: game.settings?.difficulty,
    excludeIndices: game.clue_history,
  })
  changes.clues = pair
  changes.clue_history = insertLimited(index, game.clue_history, 16)

  changes.round_number = game.round_number + 1
  changes.round_started_at = now

  changes.phase = 'choose'

  await fromGames(db).updateOne(filter, {
    $set: changes,
    $unset: toMongoUnset(deletes),
  })
}
