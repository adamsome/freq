import { CurrentFreqGameView, FreqPlayerStats } from '../../../types/freq.types'
import { Dict } from '../../../types/object.types'
import { connectToDatabase } from '../../../util/mongodb'
import { fromGames } from '../freq-game-store'
import { isGuessingFreqPhase } from '../freq-phase'
import {
  sumFreqPlayerStats,
  createFreqPlayerStats,
  generateFreqRoundStats,
} from '../freq-player-stats'
import {
  findManyFreqPlayerStatsByID,
  upsertManyFreqPlayerStatsByID,
} from '../freq-player-stats-store'
import revealMatchResults from './reveal-match-results'

export default async function (game: CurrentFreqGameView) {
  if (!isGuessingFreqPhase(game.phase))
    throw new Error('Can only reveal from a guessing phase.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentFreqGameView> = {}

  changes.phase = 'reveal'

  // Get round scores and add to state scores
  const { roundStats, scoreTeam1, scoreTeam2 } = generateFreqRoundStats(game)

  const totalTeam1 = game.score_team_1 + scoreTeam1
  const totalTeam2 = game.score_team_2 + scoreTeam2

  const tied = totalTeam1 === totalTeam2
  const win1 = !tied && totalTeam1 >= 10
  const win2 = !tied && totalTeam2 >= 10
  const win = win1 || win2
  const repeatTurn =
    (scoreTeam1 === 4 && totalTeam1 < totalTeam2) ||
    (scoreTeam2 === 4 && totalTeam1 > totalTeam2)

  // Update team scores
  changes.score_team_1 = totalTeam1
  changes.score_team_2 = totalTeam2

  const playerIDs = Object.keys(roundStats)

  const totalStats = await findManyFreqPlayerStatsByID(playerIDs)

  // Increment room stats with round stats for each player
  const { room, total } = playerIDs.reduce(
    (acc, id) => {
      const roundPlayerStats = roundStats[id]

      const player = game.players.find((p) => p.id === id)
      if (
        player &&
        ((player.team === 1 && win1) || (player.team === 2 && win2))
      ) {
        roundPlayerStats.w++
      }

      const roomPlayerStats = game.stats?.[id] ?? createFreqPlayerStats(id)
      const totalPlayerStats = totalStats[id] ?? createFreqPlayerStats(id)

      acc.room[id] = sumFreqPlayerStats(roomPlayerStats, roundPlayerStats)
      acc.total[id] = sumFreqPlayerStats(totalPlayerStats, roundPlayerStats)
      return acc
    },
    { room: {}, total: {} } as {
      room: Dict<FreqPlayerStats>
      total: Dict<FreqPlayerStats>
    }
  )

  changes.stats = room

  await fromGames(db).updateOne(filter, { $set: changes })

  await upsertManyFreqPlayerStatsByID(total)

  if (win) {
    return await revealMatchResults(game)
  }

  if (repeatTurn) {
    await fromGames(db).updateOne(filter, {
      $set: { repeat_turn: true },
      $unset: { next_psychic: '' },
    })
  }
}
