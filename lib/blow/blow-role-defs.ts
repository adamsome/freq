import {
  BlowRoleDef,
  BlowRoleID,
  BlowThemeID,
  BLOW_ROLE_IDS,
} from '../types/blow.types'
import { isObject } from '../util/object'
import { isNotEmpty, isNotNil } from '../util/string'
import { BLOW_COLOR_COMBOS } from './blow-color-classes'

const DEFS_BY_ID: Record<BlowRoleID, BlowRoleDef> = {
  common: {
    id: 'common',
    common: true,
    name: 'Common',
    actions: ['activate_income', 'activate_extort', 'activate_blow'],
  },
  killer: {
    id: 'killer',
    name: 'Hitman',
    hasNoCounters: true,
    actions: ['activate_kill'],
    classes: BLOW_COLOR_COMBOS.orangeTeal,
  },
  thief: {
    id: 'thief',
    name: 'Marauder',
    actions: ['activate_raid', 'counter_raid'],
    classes: BLOW_COLOR_COMBOS.purpleBlue,
  },
  merchant: {
    id: 'merchant',
    name: 'Tycoon',
    actions: ['activate_trade', 'counter_extort'],
    classes: BLOW_COLOR_COMBOS.yellowRed,
  },
  guard: {
    id: 'guard',
    name: 'Bodyguard',
    hasNoActive: true,
    actions: ['counter_kill'],
    classes: BLOW_COLOR_COMBOS.fuchsiaFuchsia,
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    actions: ['activate_explore', 'counter_raid_explore'],
    classes: BLOW_COLOR_COMBOS.emeraldViolet,
  },
}

const THEMED_DEFS_BY_ID: Partial<
  Record<BlowThemeID, Partial<Record<BlowRoleID, Partial<BlowRoleDef>>>>
> = {
  magic: {
    killer: { name: 'Evocation' },
    thief: { name: 'Necromancy' },
    merchant: { name: 'Transmutation' },
    guard: { name: 'Abjuration' },
    explorer: { name: 'Conjuration' },
  },
}

const _getRole = (tid: BlowThemeID) => {
  const themeDefs = THEMED_DEFS_BY_ID[tid]

  return (rid: BlowRoleID): BlowRoleDef => {
    const def = DEFS_BY_ID[rid as BlowRoleID]
    const themeDef = themeDefs?.[rid as BlowRoleID]
    return { ...def, ...(themeDef ?? {}) }
  }
}

export function getBlowRole(tid: BlowThemeID): (rid: BlowRoleID) => BlowRoleDef
export function getBlowRole(tid: BlowThemeID, rid: BlowRoleID): BlowRoleDef
export function getBlowRole(
  tid: BlowThemeID,
  rid?: BlowRoleID
): BlowRoleDef | ((rid: BlowRoleID) => BlowRoleDef) {
  const getRole = _getRole(tid)
  if (rid == null) return getRole
  return getRole(rid)
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
