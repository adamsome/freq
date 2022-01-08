import { BlowRoleDef, BlowRoleID, BLOW_ROLE_IDS } from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty, isNotNil } from '../util/string'

export const BLOW_ROLE_DEFS: Record<BlowRoleID, BlowRoleDef> = {
  common: {
    id: 'common',
    common: true,
    name: 'Common',
    actions: ['income', 'extort', 'blow'],
  },
  killer: {
    id: 'killer',
    name: 'Hitman',
    hasNoCounters: true,
    actions: ['activate_kill'],
  },
  thief: {
    id: 'thief',
    name: 'Marauder',
    actions: ['activate_raid', 'counter_raid'],
  },
  merchant: {
    id: 'merchant',
    name: 'Tycoon',
    actions: ['activate_trade', 'counter_extort'],
  },
  guard: {
    id: 'guard',
    name: 'Bodyguard',
    actions: ['counter_kill'],
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    actions: ['activate_explore', 'counter_raid'],
  },
}

export function isBlowRoleDef(role: unknown): role is BlowRoleDef {
  return (
    isObject(role) &&
    isNotEmpty(role.id, role.name) &&
    isNotNil(role.actions) &&
    BLOW_ROLE_IDS.includes(role.id as BlowRoleID)
  )
}

// const GENERIC_MAP: Record<BlowCardRoleID, Partial<BlowCardRole>> = {
//   killer: { name: 'Hitman' },
//   thief: { name: 'Raider' },
//   merchant: { name: 'Tycoon' },
//   guard: { name: 'Bodyguard' },
//   explorer: {
//     name: 'Diplomat',
//     actions: [{ ...a.explore, name: 'Diplomacy' }, a.counter_raid],
//   },
// }

// const FF_ROLES: BlowCardRole[] = [
//   { id: 'black', name: 'Black Mage', actions: [] },
//   { id: 'blue', name: 'Blue Mage', actions: [] },
//   { id: 'red', name: 'Red Mage', actions: [] },
//   { id: 'white', name: 'White Mage', actions: [] },
//   { id: 'green', name: 'Green Mage', actions: [] },
// ]
