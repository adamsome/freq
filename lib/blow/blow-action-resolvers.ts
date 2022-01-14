import { BlowAction, BlowRoleActionID } from '../types/blow.types'
import BlowState from './blow-state'

export const BLOW_ACTION_RESOLVERS: Record<
  BlowRoleActionID,
  (s: BlowState, x: BlowAction) => BlowState
> = {
  activate_blow: (s) => s,
  activate_explore: (s) => s,
  activate_extort: (s, x) => s.addCoins(x.payload.subject, 2),
  activate_income: (s, x) => s.addCoins(x.payload.subject, 1),
  activate_kill: (s) => s,
  activate_raid: (s) => s,
  activate_trade: (s, x) => s.addCoins(x.payload.subject, 3),
  counter_extort: (s) => s,
  counter_kill: (s) => s,
  counter_raid: (s) => s,
}
