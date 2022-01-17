import invariant from 'tiny-invariant'
import { BlowActionTurnInfo, BlowRoleActionID } from '../types/blow.types'
import BlowState from './blow-state'

const earn = (coins: number) => {
  return (s: BlowState, x: BlowActionTurnInfo): BlowState => {
    return s.addCoins(x.payload.subject, coins).setCommand('next_turn')
  }
}

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

const steal = (maxCoins: number) => {
  return (s: BlowState, x: BlowActionTurnInfo): BlowState => {
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
}

const draw = (s: BlowState, x: BlowActionTurnInfo): BlowState => {
  return s
    .setupDrawCard(x, x.def.cards ?? 1)
    .setCommand('next_turn', { disabled: true })
}

const noop = (s: BlowState, _x: BlowActionTurnInfo): BlowState =>
  s.setCommand('next_turn')

export const BLOW_ACTION_RESOLVERS: Record<
  BlowRoleActionID,
  (s: BlowState, x: BlowActionTurnInfo) => BlowState
> = {
  activate_income: earn(1),
  activate_extort: earn(2),
  activate_blow: kill,
  activate_kill: kill,
  activate_raid: steal(2),
  counter_raid: noop,
  activate_trade: earn(3),
  counter_extort: noop,
  counter_kill: noop,
  activate_explore: draw,
}
