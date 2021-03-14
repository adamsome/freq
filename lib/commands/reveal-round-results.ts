import { CurrentGameView, PlayerStats } from '../../types/game.types'
import { Dict } from '../../types/object.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../game-store'
import { isGuessingPhase } from '../phase'
import {
  sumPlayerStats,
  createPlayerStats,
  generateRoundStats,
} from '../player-stats'
import revealMatchResults from './reveal-match-results'

export default async function (game: CurrentGameView) {
  if (!isGuessingPhase(game.phase))
    throw new Error('Can only reveal from a guessing phase.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<CurrentGameView> = {}

  changes.phase = 'reveal'

  // Get round scores and add to state scores
  const { stats, scoreTeam1, scoreTeam2 } = generateRoundStats(game)

  const totalTeam1 = game.score_team_1 + scoreTeam1
  const totalTeam2 = game.score_team_2 + scoreTeam2

  const tied = totalTeam1 === totalTeam2
  const win1 = !tied && totalTeam1 >= 10
  const win2 = !tied && totalTeam2 >= 10
  const win = win1 || win2
  const repeatTurn =
    (scoreTeam1 === 4 && totalTeam1 < totalTeam2) ||
    (scoreTeam2 === 4 && totalTeam1 > totalTeam2)

  changes.score_team_1 = totalTeam1
  changes.score_team_2 = totalTeam2

  changes.stats = Object.keys(stats).reduce((acc, playerID) => {
    const inc = stats[playerID]

    const player = game.players.find((p) => p.id === playerID)
    if (
      player &&
      ((player.team === 1 && win1) || (player.team === 2 && win2))
    ) {
      inc.w++
    }

    const prev = game.stats?.[playerID] ?? createPlayerStats(playerID)
    acc[playerID] = sumPlayerStats(prev, inc)
    return acc
  }, {} as Dict<PlayerStats>)

  await fromGames(db).updateOne(filter, { $set: changes })

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
