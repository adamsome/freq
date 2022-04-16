import { BlowLabelDef, BlowToken, BlowTurnView } from '../types/blow.types'
import BlowState from './blow-state'

export function buildBlowActiveBoxLabel(
  state: BlowState,
  turn: BlowTurnView
): BlowLabelDef {
  const active = state.activePlayer?.index
  const { target, targetable } = turn
  const label: BlowLabelDef = [
    active != null ? { type: 'player', value: active } : 'Player',
  ]
  if (targetable && !target) {
    label.push(
      !state.isActivePlayer ? 'must choose target' : 'is choosing target...'
    )
  } else {
    label.push('casts a spell')
  }
  return label
}

export function buildCounterBoxLabel(
  state: BlowState,
  turn: BlowTurnView
): BlowLabelDef {
  const counterPlayerIndex = state.counterIndices?.[0]
  const {
    step,
    role,
    action: action,
    target,
    targetable,
    counters,
    counterAction: counter,
  } = turn

  const targetToken: BlowLabelDef = !targetable
    ? 'Any player'
    : target
    ? { type: 'player', value: target }
    : 'Target'

  const className = 'text-black/80 dark:text-white/80'
  const roleToken: BlowToken =
    role === 'common'
      ? { type: 'action', value: action, role, border: false, className }
      : { type: 'role', value: role, border: false, className }

  if (!counters.length) {
    return ['No counter spells available for', roleToken]
  }

  switch (step) {
    case 'active-choose':
    case 'active-challenge': {
      return [
        targetToken,
        'can counter once players had a challenge opportunity',
      ]
    }
    case 'counter-choose': {
      return [targetToken, 'has the opportunity to counter', roleToken]
    }
    case 'counter-challenge': {
      return [
        counterPlayerIndex != null
          ? { type: 'player', value: counterPlayerIndex }
          : targetToken,
        'casts a counter spell. Any player can challenge.',
      ]
    }
    case 'next': {
      if (!counter) {
        return [targetable ? targetToken : 'All players', 'declined to counter']
      }
      if (counterPlayerIndex != null) {
        return [
          { type: 'player', value: counterPlayerIndex },
          'casts a counter spell',
        ]
      }
      return 'No counters'
    }
  }
}
