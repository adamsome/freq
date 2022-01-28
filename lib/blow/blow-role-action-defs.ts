import {
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowThemeID,
} from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty, isNotNil } from '../util/string'
import { BLOW_COLOR_COMBOS } from './blow-color-classes'

const DEFS_BY_ID: Record<BlowRoleActionID, BlowRoleActionDef> = {
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
    targetEffect: 'kill',
    classes: BLOW_COLOR_COMBOS.roseSlate,
  },
  activate_kill: {
    id: 'activate_kill',
    name: 'Kill',
    label: 'Kill target',
    coins: 3,
    targetEffect: 'kill',
  },
  activate_raid: {
    id: 'activate_raid',
    name: 'Raid',
    label: ['Steal', { type: 'coin', value: 2 }],
    targetEffect: 'steal',
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
    counterLabel: 'Extort',
  },
  counter_kill: {
    id: 'counter_kill',
    name: 'Counter',
    counter: 'activate_kill',
    counterLabel: 'Kill',
  },
  activate_explore: {
    id: 'activate_explore',
    name: 'Explore',
    label: ['Draw', { type: 'card', value: 2 }],
    counterLabel: 'Raid',
    cards: 2,
  },
  counter_raid_explore: {
    id: 'counter_raid_explore',
    name: 'Counter',
    counter: 'activate_raid',
    counterLabel: 'Raid',
  },
}

const THEMED_DEFS_BY_ID: Partial<
  Record<
    BlowThemeID,
    Partial<Record<BlowRoleActionID, Partial<BlowRoleActionDef>>>
  >
> = {
  magic: {
    activate_income: {
      name: 'Rest',
      label: ['Gain', { type: 'coin', value: 1 }],
    },
    activate_extort: {
      name: 'Potion',
      label: ['Gain', { type: 'coin', value: 2 }],
    },
    activate_blow: { name: 'Blow', label: 'Attack' },
    activate_kill: {
      name: 'Attack',
      label: ['Attack Target'],
    },
    activate_trade: { label: ['Gain', { type: 'coin', value: 3 }] },
    activate_raid: {
      name: 'Leech',
      label: ['Leech', { type: 'coin', value: 2 }],
    },
    counter_extort: { counterLabel: 'Potion' },
    counter_kill: { counterLabel: 'Evocation' },
    counter_raid: { counterLabel: 'Necromancy' },
    counter_raid_explore: { counterLabel: 'Necromancy' },
  },
}

const _getRoleAction = (tid: BlowThemeID) => {
  const themedDefs = THEMED_DEFS_BY_ID[tid]

  return (xid: BlowRoleActionID): BlowRoleActionDef => {
    const def = DEFS_BY_ID[xid]
    const themedDef = themedDefs?.[xid]
    return { ...def, ...(themedDef ?? {}) }
  }
}

export function getBlowRoleAction(
  tid: BlowThemeID
): (xid: BlowRoleActionID) => BlowRoleActionDef
export function getBlowRoleAction(
  tid: BlowThemeID,
  xid: BlowRoleActionID
): BlowRoleActionDef
export function getBlowRoleAction(
  tid: BlowThemeID,
  xid?: BlowRoleActionID
): BlowRoleActionDef | ((xid: BlowRoleActionID) => BlowRoleActionDef) {
  const getRole = _getRoleAction(tid)
  if (xid == null) return getRole
  return getRole(xid)
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
