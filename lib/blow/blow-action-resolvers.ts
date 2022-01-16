import invariant from 'tiny-invariant'
import { BlowActionTurnInfo, BlowRoleActionID } from '../types/blow.types'
import BlowState from './blow-state'

const kill = (s: BlowState, x: BlowActionTurnInfo): BlowState => {
  invariant(x.payload.target != null, 'Blow action needs a target')
  const lastRemaining = s.getLastRemainingPlayerCardIndex(x.payload.target)
  if (lastRemaining != null) {
    // Target has only one card left: reveal it automatically
    const target = s.getPlayer(x.payload.target)
    target.cardsKilled[lastRemaining] = true
    return s.setupPickLossCard(x, lastRemaining).setCommand('next_turn')
  }
  if (s.isPlayerEliminated(x.payload.target)) {
    return s.setCommand('next_turn')
  }
  return s.setupPickLossCard(x).setCommand('next_turn', { disabled: true })
}

const steal =
  (maxCoins: number) =>
  (s: BlowState, x: BlowActionTurnInfo): BlowState => {
    invariant(x.payload.target != null, 'Blow action needs a target')
    if (s.isPlayerEliminated(x.payload.target)) {
      return s.setCommand('next_turn')
    }

    let coins = maxCoins
    const target = s.getPlayer(x.payload.target)
    if (target.coins < maxCoins) {
      coins = target.coins
    }
    return s
      .addCoins(x.payload.target, -coins)
      .addCoins(x.payload.subject, coins)
      .setCommand('next_turn')
  }

const addCoins =
  (coins: number) =>
  (s: BlowState, x: BlowActionTurnInfo): BlowState =>
    s.addCoins(x.payload.subject, coins).setCommand('next_turn')

const noop = (s: BlowState, _x: BlowActionTurnInfo): BlowState =>
  s.setCommand('next_turn')

export const BLOW_ACTION_RESOLVERS: Record<
  BlowRoleActionID,
  (s: BlowState, x: BlowActionTurnInfo) => BlowState
> = {
  activate_blow: kill,
  activate_explore: (s) => {
    // TODO
    return s.setCommand('next_turn')
  },
  activate_extort: addCoins(2),
  activate_income: addCoins(1),
  activate_kill: kill,
  activate_raid: steal(2),
  activate_trade: addCoins(3),
  counter_extort: noop,
  counter_kill: noop,
  counter_raid: noop,
}
