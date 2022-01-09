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
) {
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
    if (!value || value.type !== type)
      throw new Error('Core action is not currently applicable.')
    if (cmd?.disabled) throw new Error('Core action is disabled.')
  }

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  if (!action.payload) action.payload = {}
  if (!action.payload.subject) action.payload.subject = userID

  await fromBlowGames(db).updateOne(filter, {
    $set: { actions: [...game.actions, action] },
  })
}
