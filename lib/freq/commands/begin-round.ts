import { CurrentFreqGameView, FreqGame } from '../../../types/freq.types'
import { connectToDatabase, toMongoUnset } from '../../../util/mongodb'
import { getNextPsychic } from '../freq-game'
import { fromGames } from '../freq-game-store'
import { doesGameHaveEnoughPlayers } from '../../game'
import { isFreeFreqPhase } from '../freq-phase'
import randomFreqCluePair from '../random-freq-clue-pair'

function updateClueHistory(game: CurrentFreqGameView, index: number): number[] {
  let history = game.clue_history ?? []
  const len = history.length
  history = len >= 16 ? history.slice(len - 15, len - 1) : history.slice()
  history.push(index)
  return history
}

export default async function (game: CurrentFreqGameView) {
  if (!isFreeFreqPhase(game.phase))
    throw new Error('Can only begin a round from the free phases.')

  if (!doesGameHaveEnoughPlayers(game))
    throw new Error('Must have at least 2 players per team to begin round.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentFreqGameView> = {}
  const deletes: (keyof FreqGame)[] = []

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

  const { pair, index } = randomFreqCluePair({
    excludeIndices: game.clue_history,
  })
  changes.clues = pair
  changes.clue_history = updateClueHistory(game, index)

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
