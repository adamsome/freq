import { BlowCardRole, BlowCardRoleID } from '../types/blow.types'

export const BLOW_CARD_ROLE_DEFS: Record<BlowCardRoleID, BlowCardRole> = {
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
