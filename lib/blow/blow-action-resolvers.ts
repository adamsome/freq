import invariant from 'tiny-invariant'
import {
  BlowActionTurnInfo,
  BlowLabelDef,
  BlowRoleActionID,
} from '../types/blow.types'
import BlowState from './blow-state'

const earn = (coins: number) => {
  return (s: BlowState, x: BlowActionTurnInfo): BlowState => {
    invariant(x.payload.subject != null, 'Action needs subject to earn coins')
    const msg: BlowLabelDef = [
      { type: 'player', value: x.payload.subject },
      'earns',
      { type: 'coin', value: coins },
    ]
    return s
      .addCoins(x.payload.subject, coins)
      .addMessage(msg, { asResolution: true })
      .setCommand('next_turn')
  }
}

const kill = (s: BlowState, x: BlowActionTurnInfo): BlowState => {
  invariant(x.payload.target != null, 'Action needs a target')
  invariant(x.payload.subject != null, 'Action needs subject to earn coins')
  const msg: BlowLabelDef = [{ type: 'player', value: x.payload.subject }]

  const lastRemaining = s.getLastRemainingPlayerCardIndex(x.payload.target)
  if (lastRemaining != null) {
    // Target has only one card left: reveal it automatically
    const target = s.getPlayer(x.payload.target)
    target.cardsKilled[lastRemaining] = true

    msg.push('eliminates', { type: 'player', value: x.payload.target })
    return s
      .setupPickLossCard(x, lastRemaining)
      .addMessage(msg, { asResolution: true })
      .setCommand('next_turn')
  }

  if (s.isPlayerEliminated(x.payload.target)) {
    msg.push(
      { type: 'player', value: x.payload.target },
      'is already eliminated'
    )
    return s.addMessage(msg, { asResolution: true }).setCommand('next_turn')
  }

  msg.push('kills a card from', { type: 'player', value: x.payload.target })
  return s
    .setupPickLossCard(x)
    .addMessage(msg, { asResolution: true })
    .setCommand('next_turn', { disabled: true })
}

const steal = (maxCoins: number) => {
  return (s: BlowState, x: BlowActionTurnInfo): BlowState => {
    invariant(x.payload.target != null, 'Blow action needs a target')
    invariant(x.payload.subject != null, 'Action needs subject to earn coins')
    const msg: BlowLabelDef = [{ type: 'player', value: x.payload.subject }]

    if (s.isPlayerEliminated(x.payload.target)) {
      msg.push('cannot steal from already eliminated', {
        type: 'player',
        value: x.payload.target,
      })
      return s.setCommand('next_turn')
    }

    let coins = maxCoins
    const target = s.getPlayer(x.payload.target)
    if (target.coins < maxCoins) {
      coins = target.coins
    }

    msg.push('steals', { type: 'coin', value: coins }, 'from', {
      type: 'player',
      value: x.payload.target,
    })
    return s
      .addCoins(x.payload.target, -coins)
      .addCoins(x.payload.subject, coins)
      .addMessage(msg, { asResolution: true })
      .setCommand('next_turn')
  }
}

const draw = (s: BlowState, x: BlowActionTurnInfo): BlowState => {
  invariant(x.payload.subject != null, 'Action needs subject to earn coins')
  const cards = x.def.cards ?? 1
  const msg: BlowLabelDef = [
    { type: 'player', value: x.payload.subject },
    `draws ${cards} cards`,
  ]
  return s
    .setupDrawCard(x, cards)
    .addMessage(msg, { asResolution: true })
    .setCommand('next_turn', { disabled: true })
}

const counter = (s: BlowState, x: BlowActionTurnInfo): BlowState => {
  const activePlayer = s.turnActions.active?.payload.subject
  invariant(activePlayer != null, 'Counter needs active player to resolve')
  invariant(x.payload.subject != null, 'Counter needs subject to resolve')
  return s
    .addMessage(
      [
        { type: 'player', value: x.payload.subject },
        'successfully counters',
        { type: 'player', value: activePlayer },
        '— nothing happens.',
      ],
      {
        asResolution: true,
      }
    )
    .setCommand('next_turn')
}

export const BLOW_ACTION_RESOLVERS: Record<
  BlowRoleActionID,
  (s: BlowState, x: BlowActionTurnInfo) => BlowState
> = {
  activate_income: earn(1),
  activate_extort: earn(2),
  activate_blow: kill,
  activate_kill: kill,
  activate_raid: steal(2),
  counter_raid: counter,
  activate_trade: earn(3),
  counter_extort: counter,
  counter_kill: counter,
  activate_explore: draw,
  counter_raid_explore: counter,
}
