import { findCurrentPlayerIndex } from '../../player'
import {
  BlowAction,
  BlowGame,
  BlowGameView,
  isBlowRoleActionID,
} from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { isBlowAction } from '../blow-action-creators'
import { fromBlowGames } from '../blow-game-store'
import { buildBlowGameView } from '../blow-game-view'

export default async function actionCommand(
  game: BlowGame,
  userID: string,
  action: unknown
): Promise<void> {
  if (game.phase !== 'guess') throw new Error('Can only do action during game.')

  if (!isBlowAction(action)) throw new Error('Action is invalid.')

  const view = buildBlowGameView(userID, game)
  const valid = validateCoreAction(view, action)

  if (!valid) return

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  if (!action.payload) action.payload = {}
  if (!action.payload.subject)
    action.payload.subject = findCurrentPlayerIndex(game.players, userID)

  await fromBlowGames(db).updateOne(filter, {
    $set: { actions: [...game.actions, action] },
  })
}

/**
 * Ensure action is able to be performed.
 *
 * @returns `true` if action is valid and should be performed;
 *          `false` if action is no longer valid and should be silently ignored;
 *          throws an `Error` if action is invalid and should show error message
 */
function validateCoreAction(view: BlowGameView, action: BlowAction): boolean {
  const type = action.type

  if (isBlowRoleActionID(type)) {
    if (view.actionState[type] !== 'clickable') {
      throw new Error('Role action is not clickable.')
    }
    return true
  }

  switch (type) {
    case 'reveal-challenge-card': {
      if (!view.challenge) {
        throw new Error('Can only reveal challenge card during challenge.')
      }
      if (view.challenge.challengerLoss) {
        if (view.challenge.challenger !== view.currentPlayer?.index) {
          throw new Error('Only challenger can reveal challenge card.')
        }
      } else {
        if (view.challenge.target !== view.currentPlayer?.index) {
          throw new Error('Only target can reveal challenge card.')
        }
      }
      return true
    }
    // Regular command panel commands
    case 'challenge':
    case 'decline-counter':
    case 'continue-turn':
    case 'next-turn': {
      const cmd = view.commands[0]
      const value = cmd?.value as BlowAction | undefined

      const msg =
        !value || value.type !== action.type
          ? 'Action no longer available.'
          : cmd?.disabled
          ? 'Action is disabled.'
          : null
      if (msg) {
        // If auto-generated action indicating that a timer expired, ignore;
        // otherwise throw to let frontend know that an invalid action was sent
        if (!action.payload.expired) throw new Error(msg)
        return false
      }
      return true
    }
  }
}
