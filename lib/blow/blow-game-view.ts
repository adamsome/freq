import { OptionalId, WithId } from 'mongodb'
import { BlowGame, BlowGameView } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'
import { getBlowRoles } from './blow-variants'
import createBlowPlayerViews from './create-blow-player-views'

export function buildBlowGameView(
  userID: string | undefined,
  game: OptionalId<WithId<BlowGame>>
): BlowGameView {
  const view: OptionalId<WithId<BlowGameView>> = {
    ...game,
    type: 'blow',
    players: game.players,
    roles: getBlowRoles(game.settings.variant),
    commands: [
      {
        type: 'begin_round',
        text: 'Deal Cards',
        disabled: game.players.length < 3,
      },
    ],
    actionState: {
      activate_explore: 'clickable',
      activate_kill: 'active',
      activate_raid: 'active',
      activate_trade: 'clickable',
      counter_raid: 'counter',
      counter_kill: 'clickable',
      // counter_extort: 'normal',
      income: 'normal',
      extort: 'normal',
      blow: 'clickable',
    },
  }

  view.players = createBlowPlayerViews(view, userID)

  const currentPlayerIndex = game.players.findIndex((p) => p.id === userID)
  if (currentPlayerIndex >= 0) {
    view.currentPlayer = view.players[currentPlayerIndex]
  }

  delete view._id
  return view
}

export function isBlowGameView(game: unknown): game is BlowGameView {
  return (
    isObject(game) &&
    isNotEmpty(game.room, game.phase) &&
    game.players != null &&
    game.player_order != null
  )
}
