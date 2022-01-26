import { findCurrentPlayerIndex } from '../../player'
import {
  BlowAction,
  BlowGame,
  BlowGameView,
  isBlowRoleActionID,
} from '../../types/blow.types'
import { connectToDatabase } from '../../util/mongodb'
import {
  isActionWithBlowDrawSelectionPaylod,
  isBlowAction,
} from '../blow-action-creators'
import { finalize } from '../blow-action-reducer'
import { fromBlowGames } from '../blow-game-store'
import { buildBlowGameView } from '../blow-game-view'
import { upsertManyBlowPlayerStatsByID } from '../blow-player-stats-store'
import { getBlowRoleAction } from '../blow-role-action-defs'
import { updateBlowPlayerStats } from '../blow-stats'

export default async function actionCommand(
  game: BlowGame,
  userID: string,
  action: unknown
): Promise<void> {
  if (!isBlowAction(action)) throw new Error('Action is invalid.')

  if (game.phase !== 'guess' && action.type !== 'continue_turn')
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
    const { blow: futureState } = store.getState()
    view.winner = futureState.winner
  } catch (e) {
    const payload = JSON.stringify(action.payload)
    console.error(`Error validating action '${action.type}' (${payload})`)
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
    if (view.actionState[type] === 'clickable') return true

    // Validate two-step targetable active actions (i.e. Kill & Steal)
    const xdef = getBlowRoleAction(view.settings.theme, type)
    if (xdef.targetEffect && view.pickTarget) {
      if (
        action.payload.target != null &&
        view.pickTarget.targets.includes(action.payload.target) &&
        view.pickTarget.action.type === action.type &&
        view.pickTarget.action.payload.subject === action.payload.subject
      ) {
        return true
      } else {
        throw new Error('Cannot target that player.')
      }
    }

    throw new Error('Role action is not clickable.')
  }

  switch (type) {
    case 'reveal_card': {
      if (view.challenge) {
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
      if (view.pickLossCard) {
        const targetIdx = view.pickLossCard.action.payload.target
        if (targetIdx == null) {
          throw new Error('To reveal, target must be specified.')
        }
        if (targetIdx !== view.currentPlayer?.index) {
          throw new Error('Only target can reveal card.')
        }
        const cardIndex = action.payload.cardIndex
        if (cardIndex == null) {
          throw new Error('Card must be picked to reveal.')
        }
        const target = view.players[targetIdx]
        if (target?.cardsKilled[cardIndex] !== false) {
          throw new Error('Card revealed cannot have been previously revealed.')
        }
        return true
      }
      throw new Error(
        'Can only reveal card during challenge or pick loss card.'
      )
    }
    case 'select_cards': {
      const drawCards = view.drawCards
      if (!drawCards) {
        throw new Error('Can only select cards while drawing.')
      }
      if (!isActionWithBlowDrawSelectionPaylod(action)) {
        throw new Error('`select_cards` action is malformed.')
      }
      const player = view.currentPlayer
      if (!player) {
        throw new Error('Must be logged in to select cards')
      }
      if (player.index !== drawCards.action.payload.subject) {
        throw new Error('Only active player can select cards.')
      }
      const handCards = player.cardsKilled
      const aliveCards = handCards.filter((k) => !k) ?? []
      if (action.payload.length !== aliveCards.length) {
        throw new Error('Must select same number of cards as were in hand.')
      }
      const validSelection = action.payload.every((s) => {
        if (s.type === 'hand') {
          return (
            player.cardsKilled[s.index] !== true &&
            player.cards[s.index] != null
          )
        } else if (s.type === 'drawn') {
          return drawCards.drawnCards[s.index] != null
        }
      })
      if (validSelection) return true

      throw new Error('Selected cards do not match hand or drawn cards.')
    }
    // Regular command panel commands
    case 'challenge':
    case 'decline_counter':
    case 'continue_turn':
    case 'next_turn': {
      const cmd = view.commands[0]
      const value = cmd?.value as BlowAction | undefined

      const msg =
        !value || value.type !== action.type
          ? 'Action no longer available.'
          : cmd?.disabled &&
            (!cmd.allowExpiredWhenDisabled || !action.payload.expired)
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
