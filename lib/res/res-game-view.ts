import produce from 'immer'
import { OptionalId, WithId } from 'mongodb'
import { findCurrentPlayer } from '../player'
import { ResGame, ResGameView } from '../types/res.types'
import { isObject } from '../util/object'
import { setRandomNumberGeneratorSeed } from '../util/prng'
import { shuffle } from '../util/random'
import { isNotEmpty } from '../util/string'
import createResCommandView from './create-res-command-view'
import { getResMissionIndex, getResRoundIndex, isResSpy } from './res-engine'

const sanitize = produce((game: ResGameView, userID?: string) => {
  if (!isResSpy(game, userID) && game.phase !== 'win') {
    game.spies = []
  }
  if (game.step === 'team_vote') {
    const missionIndex = getResMissionIndex(game)
    const roundIndex = getResRoundIndex(game)
    const votes = game.missions[missionIndex]?.[roundIndex]?.votes
    if (votes != null) {
      const sanitizedVotes = votes.map((v) => (v != null ? true : v))
      game.missions[missionIndex][roundIndex].votes = sanitizedVotes
    }
  }
  if (game.step === 'mission') {
    const missionIndex = getResMissionIndex(game)
    const roundIndex = getResRoundIndex(game)
    const result = game.missions[missionIndex]?.[roundIndex]?.result
    if (result != null) {
      const sanitizedResults = result.map((v) => (v != null ? true : v))
      game.missions[missionIndex][roundIndex].result = sanitizedResults
    }
  }
  if (game.phase !== 'win' && game.step !== 'mission') {
    for (let missionIdx = 0; missionIdx < game.missions.length; missionIdx++) {
      const mission = game.missions[missionIdx]
      for (let roundIdx = 0; roundIdx < mission.length; roundIdx++) {
        const result = game.missions[missionIdx]?.[roundIdx]?.result
        if (result != null) {
          const shuffledResults = shuffle(result)
          game.missions[missionIdx][roundIdx].result = shuffledResults
        }
      }
    }
  }
})

export function buildResGameView(
  rawGame: OptionalId<WithId<ResGame>>,
  userID?: string
): ResGameView {
  try {
    // Delete the DB `_id` object since its not serializable
    const game = { ...rawGame } as ResGame
    delete (game as OptionalId<WithId<ResGame>>)._id

    // Set up the random number generator (RNG), seeding it from the game object
    // Throughout a given match, since the seed remains the same,
    // the RNG will generator the same random numbers in the same order allowing
    // the game state to be built the same way when iterating the action list
    const date = game.match_started_at ?? new Date().toISOString()
    const seed = `${game.match_number}_${date}_${game.room}`
    setRandomNumberGeneratorSeed(seed)

    // Create the frontend's game view from the up-to-date game state
    const currentPlayer = findCurrentPlayer(game.players, userID)
    const commands = createResCommandView(game, currentPlayer)
    const view: ResGameView = {
      type: 'res',
      ...game,
      ...commands,
      currentPlayer,
    }
    return sanitize(view, userID)
  } catch (e) {
    console.error('Unexpected:', e)
    throw new Error(e)
  }
}

export function isResGameView(game: unknown): game is ResGameView {
  return (
    isObject(game) &&
    isNotEmpty(game.room, game.phase) &&
    game.players != null &&
    game.player_order != null &&
    game.missions != null &&
    game.spies != null
  )
}
