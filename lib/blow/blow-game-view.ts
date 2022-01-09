import { configureStore } from '@reduxjs/toolkit'
import { OptionalId, WithId } from 'mongodb'
import { findCurrentPlayer } from '../player'
import { BlowGame, BlowGameView } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'
import { seedBlowRandomNumberGenerator } from './blow-random'
import blowReducer, { initialState, prep } from './blow-action-reducer'

export function buildBlowGameView(
  userID: string | undefined,
  rawGame: OptionalId<WithId<BlowGame>>
): BlowGameView {
  try {
    const game = { ...rawGame } as BlowGame
    delete (game as OptionalId<WithId<BlowGame>>)._id

    seedBlowRandomNumberGenerator(game)

    const store = configureStore({
      reducer: { blow: blowReducer },
      preloadedState: { blow: { ...initialState, game, userID } },
    })

    store.dispatch(prep())
    game.actions.forEach((a) => store.dispatch(a))

    const { blow: state } = store.getState()

    const view: OptionalId<WithId<BlowGameView>> = {
      ...game,
      type: 'blow',
      roles: state.roles,
      commands: state.commands,
      messages: state.messages,
      actionState: state.actionState,
      players: state.players,
      currentPlayer: findCurrentPlayer(state.players, userID),
      // actionState: {
      //   activate_explore: 'clickable',
      //   activate_kill: 'active',
      //   activate_raid: 'active',
      //   activate_trade: 'clickable',
      //   counter_raid: 'counter',
      //   counter_kill: 'clickable',
      //   // counter_extort: 'normal',
      //   income: 'normal',
      //   extort: 'normal',
      //   blow: 'clickable',
      // },
    }

    delete view._id
    return view
  } catch (e) {
    console.error('error', e)
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
