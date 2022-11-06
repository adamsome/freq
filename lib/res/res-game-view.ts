import { OptionalId, WithId } from 'mongodb'
import { ResGame, ResGameView } from '../types/res.types'
import { isObject } from '../util/object'
import { setRandomNumberGeneratorSeed } from '../util/prng'
import { isNotEmpty } from '../util/string'

export function buildResGameView(
  rawGame: OptionalId<WithId<ResGame>>,
  _userID?: string
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
    const view: ResGameView = {
      type: 'res',
      ...game,
      commands: [],
    }
    return view
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
    game.player_order != null
  )
}
