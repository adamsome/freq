import { findCurrentPlayerIndex } from '../../player'
import {
  BlowAction,
  BlowGame,
  isBlowCoreActionID,
  isBlowRoleActionID,
} from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { isBlowAction } from '../blow-action-creators'
import { fromBlowGames } from '../blow-game-store'
import { buildBlowGameView } from '../blow-game-view'

export default async function action(
  game: BlowGame,
  userID: string,
  action: unknown
): Promise<void> {
  if (game.phase !== 'guess') throw new Error('Can only do action during game.')

  if (!isBlowAction(action)) throw new Error('Action is invalid.')

  const view = buildBlowGameView(userID, game)

  const type = action.type
  if (isBlowRoleActionID(type)) {
    if (view.actionState[type] !== 'clickable')
      throw new Error('Role action is not clickable.')
  } else if (isBlowCoreActionID(type)) {
    const cmd = view.commands[0]
    const value = cmd?.value as BlowAction | undefined

    const msg =
      !value || value.type !== type
        ? 'Action no longer available.'
        : cmd?.disabled
        ? 'Action is disabled'
        : null
    if (msg) {
      // If auto-generated action indicating that a timer expired, ignore;
      // otherwise throw to let frontend know that an invalid action was sent
      if (!action.payload.expired) throw new Error(msg)
      return
    }
  }

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  if (!action.payload) action.payload = {}
  if (!action.payload.subject)
    action.payload.subject = findCurrentPlayerIndex(game.players, userID)

  await fromBlowGames(db).updateOne(filter, {
    $set: { actions: [...game.actions, action] },
  })
}
