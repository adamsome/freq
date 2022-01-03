import { OptionalId, WithId } from 'mongodb'
import { BlowGame, BlowGameView } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty } from '../util/string'
import createBlowPlayerViews from './create-blow-player-views'

export function toBlowGameView(
  userID: string | undefined,
  game: OptionalId<WithId<BlowGame>>
): BlowGameView {
  const players = createBlowPlayerViews(game, userID)
  const currentPlayer = players.find((p) => p.id === userID)

  const view: OptionalId<WithId<BlowGameView>> = {
    ...game,
    type: 'blow',
    currentPlayer,
    players,
  }

  delete view._id
  return view
}

export function isCwdGameView(game: unknown): game is BlowGameView {
  return (
    isObject(game) &&
    isNotEmpty(game.room, game.phase) &&
    game.players != null &&
    game.player_order != null
  )
}
