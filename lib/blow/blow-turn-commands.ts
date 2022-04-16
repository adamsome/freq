import { ButtonColor } from '../../components/control/button'
import { BlowActionTurnInfo } from '../types/blow.types'
import { Command } from '../types/game.types'
import { declineChallenge } from './blow-action-creators'
import BlowState from './blow-state'

export function createBlowTurnChallengeCommand(
  state: BlowState,
  x?: BlowActionTurnInfo
): Command {
  const userID = state.userID
  const step = state.step

  let disabled = true
  let alreadyChallenged = false
  if (x && userID && step.endsWith('challenge') && state.canPlayerChallenge) {
    const pidx = state.getPlayerIndex(userID)
    alreadyChallenged = (x?.challengesDeclined ?? []).includes(pidx)
    disabled = alreadyChallenged
  }

  const cmd = state.createCommand('challenge', { disabled })

  const color: ButtonColor = disabled ? 'gray' : 'cyan'
  cmd.color = color

  if (alreadyChallenged) {
    const declinedCount = (x?.challengesDeclined ?? []).length
    const aliveCount = state.playersAlive.filter(
      (p) => p.index !== x?.payload.subject
    ).length

    cmd.text = `Declined (${declinedCount}/${aliveCount})`
    cmd.allowExpiredWhenDisabled = true
  } else {
    cmd.rightValue = declineChallenge({})
    cmd.rightText = 'Decline'
    cmd.rightType = cmd.type
    cmd.rightTimer = cmd.timer
    delete cmd.timer
    cmd.rightDisabled = cmd.disabled
  }
  return cmd
}

export function createBlowTurnCounterCommand(
  state: BlowState,
  active: BlowActionTurnInfo
): Command {
  const userID = state.userID
  const step = state.step

  if (!userID || step !== 'counter-choose' || !state.isCounterPlayer) {
    return createBlowTurnChallengeCommand(state, state.turnActions.counter)
  }

  const pidx = state.getPlayerIndex(userID)
  const alreadyCountered = (active.countersDeclined ?? []).includes(pidx)
  const disabled = alreadyCountered

  const cmd = state.createCommand('decline_counter', { disabled })

  if (alreadyCountered) {
    const declinedCount = (active.countersDeclined ?? []).length

    cmd.text = `Declined (${declinedCount}/${state.counterPlayers.length})`
    cmd.allowExpiredWhenDisabled = true
  }

  return cmd
}

export function createBlowTurnNextCmd(state: BlowState): Command | undefined {
  const disabled = state.drawCards != null && !state.drawCards?.selected

  if (state.step !== 'next') return
  const cmd = state.createCommand('next_turn', { disabled })
  cmd.text = 'Next'
  return cmd
}
