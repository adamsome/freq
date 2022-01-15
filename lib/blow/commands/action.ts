import { findCurrentPlayerIndex } from '../../player'
import {
  BlowAction,
  BlowGame,
  BlowGameView,
  isBlowRoleActionID,
} from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import { isBlowAction } from '../blow-action-creators'
import { finalize } from '../blow-action-reducer'
import { fromBlowGames } from '../blow-game-store'
import { buildBlowGameView } from '../blow-game-view'
import { upsertManyBlowPlayerStatsByID } from '../blow-player-stats-store'
import { updateBlowPlayerStats } from '../blow-stats'

export default async function actionCommand(
  game: BlowGame,
  userID: string,
  action: unknown
): Promise<void> {
  if (!isBlowAction(action)) throw new Error('Action is invalid.')

  if (game.phase !== 'guess' && action.type !== 'continue-turn')
    throw new Error('Can only do action during game.')

  const { view, store } = buildBlowGameView(userID, game, true)
  const valid = validateCoreAction(view, action)

  if (!valid) return

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  if (!action.payload) action.payload = {}
  if (!action.payload.subject)
    action.payload.subject = findCurrentPlayerIndex(game.players, userID)

  const changes: Partial<BlowGame> = {}

  try {
    store.dispatch(action)
    store.dispatch(finalize())
    const { blow: state } = store.getState()
    view.winner = state.winner
  } catch (e) {
    const payload = JSON.stringify(action.payload)
    console.error(`Error running action '${action.type}' (${payload})`)
    throw e
  }

  changes.actions = [...game.actions, action]

  if (view.winner) {
    changes.phase = 'win'
    const now = new Date().toISOString()
    changes.match_finished_at = now
    changes.round_finished_at = now

    const [roomStats, totalStats] = await updateBlowPlayerStats(view)
    changes.stats = roomStats

    await fromBlowGames(db).updateOne(filter, { $set: changes })
    await upsertManyBlowPlayerStatsByID(totalStats)
  } else {
    await fromBlowGames(db).updateOne(filter, { $set: changes })
  }
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
          : cmd?.disabled && !action.payload.expired
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
