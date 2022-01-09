import { BlowRoleActionDef, BlowRoleActionID } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty, isNotNil } from '../util/string'

export const BLOW_ROLE_ACTIONS_DEFS: Record<
  BlowRoleActionID,
  BlowRoleActionDef
> = {
  activate_income: {
    id: 'activate_income',
    name: 'Income',
    label: ['Earn', { type: 'coin', value: 1 }],
  },
  activate_extort: {
    id: 'activate_extort',
    name: 'Extort',
    label: ['Earn', { type: 'coin', value: 2 }],
  },
  activate_blow: {
    id: 'activate_blow',
    name: 'Blow',
    label: 'Kill target',
    coins: 7,
  },
  activate_kill: {
    id: 'activate_kill',
    name: 'Kill',
    label: 'Kill target',
    coins: 3,
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
    counter: 'activate_extort',
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

export function isBlowRoleActionDef(
  action: unknown
): action is BlowRoleActionDef {
  return (
    isObject(action) &&
    isNotEmpty(action.id, action.name) &&
    (isNotNil(action.label) || isNotNil(action.counter))
  )
}
