import { configureStore } from '@reduxjs/toolkit'
import { OptionalId, WithId } from 'mongodb'
import { findCurrentPlayer } from '../player'
import { BlowGame, BlowGameView } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'
import { setRandomNumberGeneratorSeed } from '../util/prng'
import blowReducer, { initialState, prep } from './blow-action-reducer'

export function buildBlowGameView(
  userID: string | undefined,
  rawGame: OptionalId<WithId<BlowGame>>
): BlowGameView {
  try {
    // Delete the DB `_id` object since its not serializable
    const game = { ...rawGame } as BlowGame
    delete (game as OptionalId<WithId<BlowGame>>)._id

    // Set up the random number generator (RNG), seeding it from the game object
    // Throughout a given match, since the seed remains the same,
    // the RNG will generator the same random numbers in the same order allowing
    // the game state to be built the same way when iterating the action list
    const date = game.match_started_at ?? new Date().toISOString()
    const seed = `${game.match_number}_${date}_${game.room}`
    setRandomNumberGeneratorSeed(seed)

    // Initialize the temporary Redux store using the DB game object & user ID
    const store = configureStore({
      reducer: { blow: blowReducer },
      preloadedState: { blow: { ...initialState, game, userID } },
    })

    // Always run the `prep` action first to setup the state
    store.dispatch(prep())
    // Iterate through each action that has taken place during the match...
    game.actions.forEach((a) => store.dispatch(a))
    // ...to get the up-to-date game state
    const { blow: state } = store.getState()

    // Create the frontend's game view from the up-to-date game state
    return {
      ...game,
      type: 'blow',
      roles: state.roles,
      commands: state.commands,
      messages: state.messages,
      actionState: state.actionState,
      players: state.players,
      active: state.active,
      counter: state.counter,
      currentPlayer: findCurrentPlayer(state.players, userID),
    }
  } catch (e) {
    console.error('Unexpected Error', e)
    throw new Error(e)
  }
}

export function isBlowGameView(game: unknown): game is BlowGameView {
  return (
    isObject(game) &&
    isNotEmpty(game.room, game.phase) &&
    game.players != null &&
    game.player_order != null
  )
}
