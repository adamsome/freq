import { CwdPlayerStats, FullCwdGameView } from '../../types/cwd.types'
import { Dict } from '../../types/object.types'
import { connectToDatabase } from '../../util/mongodb'
import { fetchFullCwdGameView, fromCwdGames } from '../cwd-game-store'
import {
  findManyCwdPlayerStatsByID,
  upsertManyCwdPlayerStatsByID,
} from '../cwd-player-stats-store'
import { createCwdPlayerStats, sumCwdPlayerStats } from '../cwd-stats'
import beginRound from './begin-round'

export default async function lockGuess(game: FullCwdGameView) {
  const player = game.currentPlayer
  const isPlayerTurn = player.team === game.team_turn
  if (!isPlayerTurn && !player.designatedPsychic)
    throw new Error('Only non-psychic players on turn team can lock guess.')

  if (game.phase !== 'guess')
    throw new Error('Can only lock guess in the guess phase.')

  if (game.guesses?.[player.id]?.value == null)
    throw new Error('Can only lock guess once one is made.')

  // Only locked if another teammate has not already locked a guess
  if (Object.values(game.guesses).some((g) => g.locked)) {
    return
  }

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const changes: Partial<FullCwdGameView> = {}

  // Get the code index guess that the player is locking in
  const guess = game.guesses[player.id]?.value ?? -1

  const otherTeam = game.team_turn === 1 ? 2 : 1
  const psychic = game.team_turn === 1 ? game.psychic_1 : game.psychic_2
  const isFirstGuessInRound =
    game.team_turn === 1
      ? game.team_1_guesses.length === 0
      : game.team_2_guesses.length === 0

  // Reset all players' guesses for the next guess round
  changes.guesses = {}

  // Add the guess to the round's team guess tracker
  if (game.team_turn === 1) {
    changes.team_1_guesses = [...game.team_1_guesses, guess]
  } else {
    changes.team_2_guesses = [...game.team_2_guesses, guess]
  }

  // Add the guess to the list of revealed codes
  if (guess >= 0) {
    changes.code_reveals = [...game.code_reveals, guess]
  }

  // Get the corresponding code state of the guess
  const state = guess != null ? game.code_states[guess] ?? 0 : 0

  let repeatTurn = false
  const pts = { 1: 0, 2: 0 }
  const win = { 1: false, 2: false }

  // Calculate points gained/lossed based on the guess result
  if (state === game.team_turn) {
    // Correct guess so team can guess again
    pts[game.team_turn] = 1
    repeatTurn = true
  } else if (state === otherTeam) {
    // Guessed other team's code, they get a pointt
    pts[otherTeam] = 1
  } else if (state === -1) {
    // Guessed the black code, other team wins
    pts[game.team_turn] = -2
    win[otherTeam] = true
  }

  // Update each team's score and check win condition
  if (pts[1] === 1) {
    changes.score_team_1 = game.score_team_1 - 1

    if (changes.score_team_1 <= 0) win[1] = true
  }

  if (pts[2] === 1) {
    changes.score_team_2 = game.score_team_2 - 1

    if (changes.score_team_2 <= 0) win[2] = true
  }

  // Get each player's all-time stats so we can update them
  const playerIDs = game.players.map((p) => p.id)
  const allTimeStats = await findManyCwdPlayerStatsByID(playerIDs)

  const { newRoomStats, newAllTimeStats } = game.players.reduce(
    (acc, player) => {
      const id = player.id
      const stats = createCwdPlayerStats(player.id)

      if (!game.settings?.designated_psychic || id !== psychic) {
        // Only update stats if player is not designated psychic

        if (id === psychic) {
          // Update psychic's round and point counts
          if (isFirstGuessInRound) stats.pn++
          stats.pp += pts[game.team_turn]
        } else if (player.team === game.team_turn) {
          // Update guesser's round and point counts
          if (isFirstGuessInRound) stats.gn++
          stats.gp += pts[game.team_turn]
        }

        // If a win occurred, update players' match and win counts
        if (win[1] || win[2]) {
          stats.g++

          if ((player.team === 1 && win[1]) || (player.team === 2 && win[2])) {
            stats.w++
          }
        }
      }

      // Get player's existing room & all-time stats and add this round's
      const roomPlayerStats = game.stats?.[id] ?? createCwdPlayerStats(id)
      const allTimePlayerStats = allTimeStats[id] ?? createCwdPlayerStats(id)

      acc.newRoomStats[id] = sumCwdPlayerStats(roomPlayerStats, stats)
      acc.newAllTimeStats[id] = sumCwdPlayerStats(allTimePlayerStats, stats)

      return acc
    },
    { newRoomStats: {}, newAllTimeStats: {} } as {
      newRoomStats: Dict<CwdPlayerStats>
      newAllTimeStats: Dict<CwdPlayerStats>
    }
  )

  changes.stats = newRoomStats

  const hasWin = win[1] || win[2]

  changes.last_act = {
    at: new Date().toISOString(),
    team: game.team_turn,
    word: game.code_words[guess],
    state,
    correct: repeatTurn,
    win: hasWin,
    pass: false,
  }

  if (hasWin) {
    changes.phase = 'win'
    changes.match_finished_at = new Date().toISOString()
  }

  await fromCwdGames(db).updateOne(filter, { $set: changes })

  await upsertManyCwdPlayerStatsByID(newAllTimeStats)

  if (!repeatTurn && !hasWin) {
    const updatedGame = await fetchFullCwdGameView(game.room, player.id)
    await beginRound(updatedGame, true)
  }
}
