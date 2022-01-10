import { addSeconds } from 'date-fns/fp'
import { isPlayer } from '../player'
import {
  BlowAction,
  BlowActionState,
  BlowGame,
  BlowMessage,
  BlowPlayerView,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowRoleDef,
  BlowRoleID,
  BlowTimer,
  BlowTimerType,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { prngShuffle } from '../util/prng'
import {
  createChallengeCommand,
  createNextTurnCommand,
} from './blow-action-creators'
import { getBlowRoleActionDef } from './blow-role-action-defs'
import { getBlowRoleDef } from './blow-role-defs'
import initBlowGame from './init-blow-game'

export interface IBlowState {
  game: BlowGame
  userID?: string
  deck: BlowRoleID[]
  roles: BlowRoleID[]
  commands: Command[]
  messages: BlowMessage[]
  actionState: Partial<Record<BlowRoleActionID, BlowActionState>>
  players: BlowPlayerView[]
  order: number[]
  turn: number
  active?: number
  counter?: number
  timer?: BlowTimer
}

type ActionStatePredicateMap = Partial<
  Record<
    BlowActionState,
    (xdef: BlowRoleActionDef, role: BlowRoleDef) => unknown
  >
>

export const initialBlowState: IBlowState = {
  game: initBlowGame(),
  deck: [],
  roles: [],
  commands: [],
  messages: [],
  players: [],
  order: [],
  turn: 0,
  actionState: {},
}

export default class BlowState {
  private s: IBlowState

  constructor(state: IBlowState) {
    this.s = state
  }

  canAffordAction(p: BlowPlayerView, x: BlowRoleActionDef): boolean {
    return (p.coins ?? 0) > (x.coins ?? 0)
  }

  canChallenge(x: BlowAction): boolean {
    return x.payload.role != null && !getBlowRoleDef(x.payload.role).common
  }

  canCounter(x: BlowAction): boolean {
    return (
      // Cannot counter a counter
      !getBlowRoleActionDef(x)?.counter &&
      // Change if any of the matches' roles' actions can counter this action
      this.s.roles.some((rid) => {
        const role = getBlowRoleDef(rid)
        role.actions.some((xid) => {
          const xdef = getBlowRoleActionDef(xid)
          return xdef.counter === x.type
        })
      })
    )
  }

  getPlayer(idOrIdx?: string | number | null): BlowPlayerView | undefined {
    if (idOrIdx == null) return
    if (typeof idOrIdx === 'number') return this.s.players[idOrIdx]
    return this.s.players.find((p) => p.id === idOrIdx)
  }

  // Fluent methods

  addMessage(text: string, { as }: { as?: string | number } = {}): this {
    const date = new Date().toISOString()
    const msg: BlowMessage = { date, text }
    if (as) {
      msg.subject = as
    } else {
      const i = this.s.counter ?? this.s.active
      if (i != null) msg.subject = i
    }
    this.s.messages.push(msg)
    return this
  }

  addCoins(
    playerIDOrIdx: string | number | null | undefined,
    coins: number
  ): this {
    const player = this.getPlayer(playerIDOrIdx)
    if (!isPlayer(player)) throw new Error('No action subject player found')
    player.coins += coins
    return this
  }

  deal(): this {
    // Deal two cards from the deck to each player
    for (let idx = 0; idx < 2; idx++) {
      this.s.game.players.forEach((_, pidx) => {
        const role = this.s.deck.pop()
        if (!role) throw new Error('Unexected Error: Deck ran out of cards')

        const p = this.s.players[pidx]
        if (!p) throw new Error('Unexected Error: Player at index empty')

        if (!p.cards) p.cards = []
        p.cards[idx] = role
      })
    }
    return this
  }

  incrementTurn(): this {
    this.s.turn = (this.s.turn + 1) % this.s.order.length
    return this
  }

  setActionStates(predicateByState: ActionStatePredicateMap): this {
    this.s.actionState = {}
    this.s.roles.forEach((rid) => {
      const role = getBlowRoleDef(rid)
      role.actions.forEach((xid) => {
        const xdef = getBlowRoleActionDef(xid)

        const statePredicates = Object.entries(predicateByState)
        statePredicates.forEach(([actionState, predicate]) => {
          if (predicate(xdef, role)) {
            this.s.actionState[xid] = actionState as BlowActionState
          }
        })
      })
    })
    return this
  }

  setActive(): this {
    delete this.s.timer
    delete this.s.counter
    this.s.active = this.s.order[this.s.turn]
    this.s.commands = createChallengeCommand('disabled')

    const activePlayer = this.s.players[this.s.active]
    const isCurrentPlayerActive = activePlayer?.id === this.s.userID
    if (isCurrentPlayerActive) {
      const mustBlow = activePlayer.coins >= 10
      this.setActionStates({
        clickable: (xdef) =>
          mustBlow
            ? xdef.id === 'activate_blow'
            : !xdef.counter && this.canAffordAction(activePlayer, xdef),
      })
    } else {
      // All actions normal for non-active players
      this.s.actionState = {}
    }
    return this
  }

  setTimerAndCommand(
    type: BlowTimerType,
    status?: 'enabled' | 'disabled'
  ): this {
    const timer = this.s.game.settings.timer[type] ?? 5
    const expiry = addSeconds(timer, new Date()).toISOString()
    this.s.timer = { type, expiry }

    switch (type) {
      case 'challenge': {
        this.s.commands = createChallengeCommand(status, timer)
      }
      case 'next-turn': {
        this.s.commands = createNextTurnCommand(status, timer)
      }
    }
    return this
  }

  setTurn(turn: number): this {
    if (turn > this.s.order.length || turn < 0)
      throw new Error('Cannot set turn higher than number of remaining players')
    this.s.turn = turn
    return this
  }

  shuffle(): this {
    this.s.deck = prngShuffle(this.s.deck)
    return this
  }
}
