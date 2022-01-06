import { BlowActionDef, BlowActionID } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty, isNotNil } from '../util/string'

export const BLOW_ACTIONS_DEFS: Record<BlowActionID, BlowActionDef> = {
  income: {
    id: 'income',
    name: 'Income',
    label: ['Earn', { type: 'coin', value: 1 }],
  },
  extort: {
    id: 'extort',
    name: 'Extort',
    label: ['Earn', { type: 'coin', value: 2 }],
  },
  blow: {
    id: 'blow',
    name: 'Blow',
    label: 'Kill target',
    payment: 7,
  },
  activate_kill: {
    id: 'activate_kill',
    name: 'Kill',
    label: 'Kill target',
    payment: 3,
  },
  activate_raid: {
    id: 'activate_raid',
    name: 'Raid',
    label: ['Steal', { type: 'coin', value: 2 }],
  },
  counter_raid: {
    id: 'counter_raid',
    name: 'Counter',
    counter: 'activate_raid',
  },
  activate_trade: {
    id: 'activate_trade',
    name: 'Trade',
    label: ['Earn', { type: 'coin', value: 3 }],
  },
  counter_extort: {
    id: 'counter_extort',
    name: 'Counter',
    counter: 'extort',
  },
  counter_kill: {
    id: 'counter_kill',
    name: 'Counter',
    counter: 'activate_kill',
  },
  activate_explore: {
    id: 'activate_explore',
    name: 'Explore',
    label: ['Draw', { type: 'card', value: 2 }],
  },
}

export function isBlowActionDef(action: unknown): action is BlowActionDef {
  return (
    isObject(action) &&
    isNotEmpty(action.id, action.name) &&
    (isNotNil(action.label) || isNotNil(action.counter))
  )
}