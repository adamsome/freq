import { configureStore, Store } from '@reduxjs/toolkit'
import { OptionalId, WithId } from 'mongodb'
import { findCurrentPlayer } from '../player'
import { BlowGame, BlowGameView } from '../types/blow.types'
import { GameType } from '../types/game.types'
import { isObject } from '../util/object'
import { setRandomNumberGeneratorSeed } from '../util/prng'
import { isNotEmpty } from '../util/string'
import blowReducer, { finalize, init } from './blow-action-reducer'
import { IBlowState, initialBlowState } from './blow-state'

interface BlowGameStore {
  view: BlowGameView
  store: Store<{ blow: IBlowState }>
}

export function buildBlowGameView(
  userID: string | undefined,
  rawGame: OptionalId<WithId<BlowGame>>
): BlowGameView
export function buildBlowGameView(
  userID: string | undefined,
  rawGame: OptionalId<WithId<BlowGame>>,
  withState: true
): BlowGameStore
export function buildBlowGameView(
  userID: string | undefined,
  rawGame: OptionalId<WithId<BlowGame>>,
  withState?: boolean
): BlowGameView | BlowGameStore {
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
      preloadedState: { blow: { ...initialBlowState, game, userID } },
    })

    // Always run the `prep` action first to setup the state
    store.dispatch(init())
    // Iterate through each action that has taken place during the match...
    game.actions.forEach((a) => {
      try {
        store.dispatch(a)
      } catch (e) {
        const payload = JSON.stringify(a.payload)
        console.error(`Error running action '${a.type}' (${payload})`)
        throw e
      }
    })
    // ...and remove any secret information for the player
    store.dispatch(finalize())
    // ...to get the up-to-date game state
    const { blow: state } = store.getState()

    // Create the frontend's game view from the up-to-date game state
    const view: BlowGameView = {
      ...game,
      type: 'blow' as GameType,
      roles: state.roles,
      commands: state.commands,
      messages: state.messages,
      actionState: state.actionState,
      players: state.players,
      currentPlayer: findCurrentPlayer(state.players, userID),
      pickTarget: state.pickTarget,
      challenge: state.challenge,
      drawCards: state.drawCards,
      pickLossCard: state.pickLossCard,
      winner: state.winner,
    }
    if (withState) {
      return { view, store }
    }
    return view
  } catch (e) {
    console.error('Unexpected:', e)
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
