import invariant from 'tiny-invariant'
import {
  BlowActionTurnInfo,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowRoleID,
  BlowTurnView,
  isBlowActionID,
} from '../types/blow.types'
import BlowState from './blow-state'
import {
  createBlowTurnChallengeCommand,
  createBlowTurnCounterCommand,
  createBlowTurnNextCmd,
} from './blow-turn-commands'
import {
  buildBlowActiveBoxLabel,
  buildCounterBoxLabel,
} from './blow-turn-labels'

const getCounters = (
  roleActions: BlowRoleActionDef[],
  active: BlowActionTurnInfo
): BlowRoleID[] =>
  roleActions
    .filter((xdef) => xdef.counter === active.type && xdef.counterRole)
    .map((xdef) => xdef.counterRole as BlowRoleID)

export default function createBlowTurnView(
  state: BlowState
): BlowTurnView | undefined {
  // Need a turn view if there is an active action
  const { active, counter } = state.turnActions
  if (active) {
    invariant(active.payload.role != null, 'Need role action to create turn')
    invariant(isBlowActionID(active.type), 'Need valid action to create turn')

    const turn: BlowTurnView = {
      step: state.step,
      role: active.payload.role,
      action: active.type as BlowRoleActionID,
      targetable: active.def.targetEffect != null,
      target: active.payload.target,
      activeLabel: '',
      activeCmd: createBlowTurnChallengeCommand(state, active),
      counterLabel: '',
      counters: getCounters(state.roleActions, active),
      counterCmd: createBlowTurnCounterCommand(state, active),
      counterAction: counter?.type as BlowRoleActionID,
      counterRole: counter?.payload?.role,
      resolution: state.resolution,
      nextCmd: createBlowTurnNextCmd(state),
    }

    turn.activeLabel = buildBlowActiveBoxLabel(state, turn)
    turn.counterLabel = buildCounterBoxLabel(state, turn)

    return turn
  }
}
