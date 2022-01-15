import invariant from 'tiny-invariant'
import { doesGameHaveEnoughPlayers } from '../game'
import { isPlayer } from '../player'
import {
  BlowAction,
  BlowActionState,
  BlowChallenge,
  BlowGame,
  BlowMessage,
  BlowPlayerView,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowRoleActionPair,
  BlowRoleDef,
  BlowRoleID,
  BlowTimerType,
  isBlowRoleActionID,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { prngShuffle } from '../util/prng'
import {
  challenge,
  continueTurn,
  createCommand,
  declineCounter,
  nextTurn,
} from './blow-action-creators'
import { BLOW_ACTION_RESOLVERS } from './blow-action-resolvers'
import { getBlowRoles } from './blow-role'
import { getBlowRoleAction } from './blow-role-action-defs'
import { getBlowRole } from './blow-role-defs'
import initBlowGame from './init-blow-game'

type ActionStatePredicateMap = Partial<
  Record<
    BlowActionState,
    (xdef: BlowRoleActionDef, role: BlowRoleDef) => unknown
  >
>

type WithDef<T> = T & {
  def: BlowRoleActionDef
  hadChallengeOpportunity?: boolean
  hadCounterOpportunity?: boolean
  countersDeclined?: number
  countered?: boolean
  paid?: boolean
}

interface TurnActions {
  active?: WithDef<BlowAction>
  counter?: WithDef<BlowAction>
}

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
  counter?: number[]
  turnActions: TurnActions
  challenge?: BlowChallenge
  winner?: BlowPlayerView
}

export const initialBlowState: IBlowState = {
  game: initBlowGame(),
  deck: [],
  roles: [],
  commands: [],
  messages: [],
  players: [],
  order: [],
  turn: 0,
  turnActions: {},
  actionState: {},
}

export default class BlowState {
  private s: IBlowState

  constructor(state: IBlowState) {
    this.s = state
  }

  get activePlayer(): BlowPlayerView | undefined {
    if (this.s.active == null) return
    return this.s.players[this.s.active]
  }

  get counterPlayers(): BlowPlayerView[] {
    return (this.s.counter ?? []).map((pidx) => this.s.players[pidx])
  }

  get isActivePlayer(): boolean {
    if (this.s.active == null) return false
    return this.activePlayer?.id === this.s.userID
  }

  get isCounterPlayer(): boolean {
    if (this.s.counter == null) return false
    return this.counterPlayers.some((p) => p.id === this.s.userID)
  }

  get latestTurnRoleAction(): WithDef<BlowAction> | undefined {
    const { active, counter } = this.s.turnActions
    return counter ?? active
  }

  get playersAlive(): BlowPlayerView[] {
    return this.s.players.filter((_, i) => !this.isPlayerEliminated(i))
  }

  get roleActions(): BlowRoleActionDef[] {
    return this.s.roles.flatMap((rid) =>
      getBlowRole(rid).actions.map((xid) => getBlowRoleAction(xid))
    )
  }

  get roleActionPairs(): BlowRoleActionPair[] {
    return this.s.roles.flatMap((rid) => {
      const role = getBlowRole(rid)
      return role.actions.map(
        (xid): BlowRoleActionPair => [role, getBlowRoleAction(xid)]
      )
    })
  }

  drawCard(): BlowRoleID {
    const card = this.s.deck.pop()
    if (!card) throw new Error(`'drawCard': Deck ran out of cards`)
    return card
  }

  getLastRemainingPlayerCardIndex(
    idOrIdx: string | number
  ): number | undefined {
    const cardsKilled = this.getPlayer(idOrIdx).cardsKilled
    const remaining = cardsKilled.filter((k) => !k).length
    if (remaining === 1) {
      return cardsKilled.findIndex((k) => !k)
    }
  }

  getPlayer(idOrIdx?: string | number | BlowPlayerView | null): BlowPlayerView {
    const p =
      typeof idOrIdx === 'number'
        ? this.s.players[idOrIdx]
        : typeof idOrIdx === 'string'
        ? this.s.players.find((p) => p.id === idOrIdx)
        : idOrIdx
    invariant(isPlayer(p), `'getPlayer': No player found for '${idOrIdx}'`)
    return p
  }

  getPlayerIndex(idOrIdx: string | number): number {
    const pidx =
      typeof idOrIdx === 'number'
        ? idOrIdx
        : this.s.players.findIndex((p) => p.id === idOrIdx)
    const inRange = pidx >= 0 || pidx < this.s.players.length
    invariant(inRange, `'getPlayerIndex': No player found for '${idOrIdx}'`)
    return pidx
  }

  isPlayerEliminated(
    idOrIdx?: string | number | BlowPlayerView | null
  ): boolean {
    return this.getPlayer(idOrIdx).cardsKilled.every(Boolean)
  }

  // Init / Finalize

  init(): this {
    this.s.roles = getBlowRoles(this.s.game.settings.variant) as BlowRoleID[]
    this.s.order = this.s.game.player_order

    // Establish deck of cards, three of each role
    this.s.deck = this.s.roles
      .map((rid) => getBlowRole(rid))
      .filter((role) => !role.common)
      .flatMap((role) => [role.id, role.id, role.id])

    // Set command to Deal Cards & enable if enough players
    const disabled = !doesGameHaveEnoughPlayers(this.s.game, 'blow')
    this.s.commands = [{ type: 'begin_round', text: 'Deal Cards', disabled }]

    // Init player view w/ an empty hand, 2 coins, & metadata
    this.s.players = this.s.game.players.map((p, index) => ({
      ...p,
      index,
      wins: this.s.game.stats?.[p.id]?.w,
      cards: [],
      cardsKilled: [false, false],
      coins: 2,
    }))

    this.s.players.forEach((p) => {
      p.cardsKilled = [false, false]
    })

    return this
  }

  finalize(): this {
    const alive: BlowPlayerView[] = []

    this.s.players.forEach((p, pidx) => {
      const cardsKilled = p.cardsKilled
      const isCurrent = p.id === this.s.userID

      // Set player statuses
      if (isCurrent) p.current = true
      if (pidx === this.s.active) p.active = true
      if (this.s.counter?.includes(pidx)) p.counter = true
      if (this.isPlayerEliminated(p)) {
        p.eliminated = true
      } else {
        alive.push(p)
      }

      // Set all non-current player unkilled cards facedown
      if (this.s.game.phase === 'guess' && !isCurrent) {
        if (!cardsKilled[0]) p.cards[0] = null
        if (!cardsKilled[1]) p.cards[1] = null
      }
    })

    invariant(alive.length !== 0, 'All players cannot be eliminated')
    if (alive.length === 1) {
      this.s.winner = alive[0]

      if (!this.s.challenge) {
        // Set command to Start New Match
        this.s.commands = [{ type: 'prep_new_match', text: 'New Match' }]
        this.addMessage('won the match!', { as: this.s.winner.index })
      }
    }

    return this
  }

  // Fluent methods

  addMessage(text?: string, { as }: { as?: string | number } = {}): this {
    const action = this.latestTurnRoleAction
    if (!action) return this

    const counter = action.def.counter
      ? getBlowRoleAction(action.def.counter)
      : undefined

    const roleText = counter
      ? `counters ${counter.name}`
      : `plays ${action.def.name}`

    const date = new Date().toISOString()
    const msg: BlowMessage = { date, text: text ?? roleText }
    if (as) {
      msg.subject = as
    } else {
      const i = action.payload.subject
      if (i != null) msg.subject = i
    }
    this.s.messages.push(msg)
    return this
  }

  addCoins(
    playerIDOrIdx: string | number | BlowPlayerView | null | undefined,
    coins: number
  ): this {
    this.getPlayer(playerIDOrIdx).coins += coins
    return this
  }

  deal(): this {
    // Deal two cards from the deck to each player
    for (let idx = 0; idx < 2; idx++) {
      this.s.game.players.forEach((_, pidx) => {
        const role = this.drawCard()

        const p = this.getPlayer(pidx)
        if (!p.cards) p.cards = []
        p.cards[idx] = role
      })
    }
    return this
  }

  incrementTurn(): this {
    // Go to the next player in turn order that is still alive
    let i = this.playersAlive.length
    do {
      this.s.turn = (this.s.turn + 1) % this.s.order.length
      i--
      if (i < 0)
        throw new Error(`'incrementTurn': No alive player to increment turn to`)
    } while (this.isPlayerEliminated(this.s.order[this.s.turn]))
    return this
  }

  processRoleActions(): this {
    const { active, counter } = this.s.turnActions
    const x = counter ?? active
    invariant(x, 'Need role action to process')
    const target = x.payload.target

    // Check if action can be challenged
    if (
      // Action hasn't already had an opportunity to be challenged
      !x.hadChallengeOpportunity &&
      // and has a non-common role (common roles cannot be challenged)
      x.payload.role != null &&
      !getBlowRole(x.payload.role).common
    ) {
      // Challenge
      this.setChallengeMode()
      return this
    } else {
      // Action payment happens after the active action challenge opportunity
      if (!active?.paid && active?.def.coins) {
        this.addCoins(this.activePlayer, -active.def.coins)
        active.paid = true
      }
    }

    // Check if action can be countered
    if (
      // Action is not a counter (counters can't be countered),
      !x.def.counter &&
      // and hasn't already had an opportunity to be countered,
      !x.hadCounterOpportunity &&
      // and has no target, or target wasn't already eliminated,
      (!target || !this.isPlayerEliminated(target)) &&
      // and any of the matches' roles' actions can counter this action
      this.roleActions.some((xdef) => xdef.counter === x.type)
    ) {
      // Counter
      this.setCounterMode()
      return this
    }

    // Resolve active action if not countered
    if (!active?.countered) {
      invariant(active, 'Cannot resolve empty action')
      invariant(
        isBlowRoleActionID(active.type),
        'Cannot resolve w/ non-role action'
      )
      BLOW_ACTION_RESOLVERS[active.type](this, active)
    }

    this.setActionStates().setTimerCommand('next-turn')

    return this
  }

  setActionStates(
    predicateByState: ActionStatePredicateMap = {},
    { resetState = true }: { resetState?: boolean } = {}
  ): this {
    if (resetState) {
      this.s.actionState = {}

      // If predicates not specified, auto-update the active/counter actions
      const { active, counter } = this.s.turnActions
      const activeID = active?.def.id
      if (activeID && !predicateByState.active) {
        predicateByState.active = (xdef) => xdef.id === activeID
      }

      const counterID = counter?.def.id
      if (counterID && !predicateByState.counter) {
        predicateByState.counter = (xdef) => xdef.id === counterID
      }
    }

    this.roleActionPairs.forEach(([role, xdef]) => {
      const statePredicates = Object.entries(predicateByState)
      statePredicates.forEach(([actionState, predicate]) => {
        if (predicate(xdef, role)) {
          this.s.actionState[xdef.id] = actionState as BlowActionState
        }
      })
    })
    return this
  }

  setActiveMode(): this {
    delete this.s.counter
    delete this.s.challenge
    this.s.turnActions = {}
    this.s.active = this.s.order[this.s.turn]
    this.setTimerCommand('challenge', true)

    const activePlayer = this.s.players[this.s.active]
    if (this.isActivePlayer) {
      const canAfford = (xdef: BlowRoleActionDef) =>
        (activePlayer.coins ?? 0) > (xdef.coins ?? 0)

      this.setActionStates({
        clickable: (xdef) =>
          activePlayer.coins >= 10
            ? // If player has more than 10 coins, forced to play blow action;
              xdef.id === 'activate_blow'
            : // Otherwise, can play any non-counter action that they can afford
              !xdef.counter && canAfford(xdef),
      })
    } else {
      // All actions normal for non-active players
      this.s.actionState = {}
    }
    return this
  }

  setChallengeMode(): this {
    const action = this.latestTurnRoleAction

    if (action?.def.counter) {
      // Set the player who played the counter action as the counter player
      const pidx = action.payload.subject
      if (pidx != null) this.s.counter = [pidx]
    }

    this.setActionStates()

    const disable =
      // Disable Challenge for the player who performed the action, and
      this.getPlayer(action?.payload?.subject).id === this.s.userID ||
      // For the current player if eliminated
      this.isPlayerEliminated(this.s.userID)
    this.setTimerCommand('challenge', disable)

    return this
  }

  setCounterMode(): this {
    const action = this.latestTurnRoleAction
    invariant(!action?.def.counter, 'Cannot counter a counter action')
    invariant(action, 'Cannot counter an empty action')

    action.hadCounterOpportunity = true

    if (action.payload.target != null) {
      // Active action is targetable, only target can counter
      this.s.counter = [action.payload.target]
    } else {
      // Active action is not targetable, all other alive players can counter
      this.s.counter = this.playersAlive
        .filter((p) => p.index !== this.s.active)
        .map((p) => p.index)
    }

    // Disable decline counter command for non-counterable players
    const disable = !this.isCounterPlayer
    this.setTimerCommand('decline-counter', disable)

    this.setActionStates()

    if (this.isCounterPlayer) {
      const counterID = action?.def.id
      this.updateActionStates({
        clickable: (xdef) => xdef.counter === counterID,
      })
    }
    return this
  }

  setTimerCommand(type: BlowTimerType, disabled?: boolean): this {
    const timer = disabled ? undefined : this.s.game.settings.timer[type] ?? 5

    switch (type) {
      case 'challenge': {
        const value = challenge({})
        const text = 'Challenge'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
      case 'decline-counter': {
        const value = declineCounter({})
        const text = 'Decline Counter'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
      case 'continue-turn': {
        const value = continueTurn({})
        const text = 'Continue'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
      case 'next-turn': {
        const value = nextTurn({})
        const text = 'Next Turn'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
    }
  }

  shuffle(): this {
    this.s.deck = prngShuffle(this.s.deck)
    return this
  }

  /** Update the current turn's action (active/counter played) tracker */
  updateTurnActions(x: BlowAction): this {
    invariant(isBlowRoleActionID(x.type), `Action '${x.type} not a role action`)
    const def = getBlowRoleAction(x.type)
    const key = !def.counter ? 'active' : 'counter'
    this.s.turnActions[key] = { ...x, def }
    return this
  }

  updateActionStates(predicateByState: ActionStatePredicateMap): this {
    return this.setActionStates(predicateByState, { resetState: false })
  }
}
