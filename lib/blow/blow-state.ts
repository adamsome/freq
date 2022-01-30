import invariant from 'tiny-invariant'
import { doesGameHaveEnoughPlayers } from '../game'
import { isPlayer } from '../player'
import {
  BlowAction,
  BlowActionState,
  BlowActionTurnInfo,
  BlowChallenge,
  BlowDrawCards,
  BlowGame,
  BlowLabelItem,
  BlowMessage,
  BlowPickLossCard,
  BlowPickTarget,
  BlowPlayerView,
  BlowRoleAction,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowRoleActionPair,
  BlowRoleDef,
  BlowRoleID,
  BlowTimerType,
  isBlowRoleActionID,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { asArray, range } from '../util/array'
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

interface TurnActions {
  active?: BlowActionTurnInfo
  counter?: BlowActionTurnInfo
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
  turn: number
  active?: number
  counter?: number[]
  turnActions: TurnActions
  pickTarget?: BlowPickTarget
  challenge?: BlowChallenge
  drawCards?: BlowDrawCards
  pickLossCard?: BlowPickLossCard
  winner?: BlowPlayerView
}

export const initialBlowState: IBlowState = {
  game: initBlowGame(),
  deck: [],
  roles: [],
  commands: [],
  messages: [],
  players: [],
  turn: 0,
  turnActions: {},
  actionState: {},
}

export default class BlowState {
  private s: IBlowState
  private toRole: (rid: BlowRoleID) => BlowRoleDef
  private toAction: (rid: BlowRoleActionID) => BlowRoleActionDef

  constructor(state: IBlowState) {
    this.s = state
    this.toRole = getBlowRole(state.game.settings.theme)
    this.toAction = getBlowRoleAction(state.game.settings.theme)
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

  get lastMessage(): BlowMessage {
    const msg = this.s.messages[this.s.messages.length - 1]
    invariant(msg != null, 'Last message is empty')
    return msg
  }

  get latestTurnRoleAction(): BlowActionTurnInfo | undefined {
    const { active, counter } = this.s.turnActions
    return counter ?? active
  }

  get playersAlive(): BlowPlayerView[] {
    return this.s.players.filter((_, i) => !this.isPlayerEliminated(i))
  }

  get roleActions(): BlowRoleActionDef[] {
    return this.s.roles.flatMap((rid) =>
      this.toRole(rid).actions.map((xid) => this.toAction(xid))
    )
  }

  get roleActionPairs(): BlowRoleActionPair[] {
    return this.s.roles.flatMap((rid) => {
      const role = this.toRole(rid)
      return role.actions.map(
        (xid): BlowRoleActionPair => [role, this.toAction(xid)]
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

    // Establish deck of cards, three of each role
    this.s.deck = this.s.roles
      .map((rid) => this.toRole(rid))
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
    if (alive.length === 1 && this.s.game.phase !== 'prep') {
      this.s.winner = alive[0]

      if (!this.s.challenge) {
        // Set command to Start New Match
        this.s.commands = [{ type: 'prep_new_match', text: 'New Match' }]

        const winnerIndex = this.s.winner.index
        const winnerToken = { type: 'player' as const, value: winnerIndex }
        this.addMessage([winnerToken, 'won the match!'])
      }
    }

    // Hide the drawn cards for selection except if this is the active player
    if (this.s.drawCards && !this.isActivePlayer) {
      this.s.drawCards.drawnCards = this.s.drawCards.drawnCards.map(() => null)
    }

    return this
  }

  // Fluent methods

  addCoins(
    playerIDOrIdx: string | number | BlowPlayerView | null | undefined,
    coins: number
  ): this {
    this.getPlayer(playerIDOrIdx).coins += coins
    return this
  }

  addActionMessage(): this {
    const { active, counter } = this.s.turnActions
    const action = counter ?? active
    invariant(action != null, 'Need action to write action message')

    const subject = action?.payload.subject
    invariant(subject != null, 'Need player to write action message')

    const player: BlowLabelItem = { type: 'player', value: subject }
    const text: BlowLabelItem[] = [player]

    const role = action.payload.role
    invariant(role != null, 'Need role to write counter action message')

    if (counter && active) {
      if (counter.addedMessage) return this
      counter.addedMessage = true

      text.push('counters w/ ', {
        type: 'action',
        value: counter.def.id,
        role,
      })
    } else {
      if (action.addedMessage) return this
      action.addedMessage = true

      text.push('plays', { type: 'action', value: action.def.id, role })
    }

    this.s.messages.push({ text, i: this.s.messages.length })

    return this
  }

  addMessage(text: BlowLabelItem | BlowLabelItem[], _date?: string): this {
    this.s.messages.push({ text, i: this.s.messages.length })
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
    // let i = this.playersAlive.length
    do {
      this.s.turn = (this.s.turn + 1) % this.s.game.player_order.length
      // i--
      // if (i < 0)
      //   throw new Error(`'incrementTurn': No alive player to increment turn to`)
    } while (this.isPlayerEliminated(this.s.game.player_order[this.s.turn]))
    return this
  }

  processRoleActions(): this {
    const { active, counter } = this.s.turnActions
    const x = counter ?? active
    invariant(x, 'Need role action to process')
    const target = x.payload.target

    // Check if action needs a target
    if (x.def.targetEffect) {
      if (target == null) {
        // Show target picker and return
        return this.setPickTarget(x).setActionStates()
      } else {
        delete this.s.pickTarget

        if (this.isPlayerEliminated(target)) {
          // If active action target has been eliminated (i.e. through
          // a challenge loss), immediately show next turn timer
          return this.setActionStates().setCommand('next_turn')
        }

        this.s.counter = [target]

        if (!x.addedTargetMessage && !x.def.counter) {
          // Add targeting to latest message
          x.addedTargetMessage = true
          let text = this.lastMessage.text
          if (!Array.isArray(text)) text = asArray(text)
          const player = { type: 'player' as const, value: target }
          text.push('targeting', player)
        }
      }
    }

    // Check if action can be challenged
    if (
      // Action hasn't already had an opportunity to be challenged
      !x.hadChallengeOpportunity &&
      // and has a non-common role (common roles cannot be challenged)
      x.payload.role != null &&
      !this.toRole(x.payload.role).common
    ) {
      // Challenge
      return this.setupChallengeMode()
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
      (target == null || !this.isPlayerEliminated(target)) &&
      // and any of the matches' roles' actions can counter this action
      this.roleActions.some((xdef) => xdef.counter === x.type)
    ) {
      // Counter
      return this.setupCounterMode()
    }

    const actionToResolve = !active?.countered ? active : counter
    invariant(actionToResolve, 'Cannot resolve empty action')
    invariant(
      isBlowRoleActionID(actionToResolve.type),
      'Cannot resolve w/ non-role action'
    )
    BLOW_ACTION_RESOLVERS[actionToResolve.type](this, actionToResolve)

    return this.setActionStates()
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

  setCommand(
    type: BlowTimerType,
    { disabled }: { disabled?: boolean } = {}
  ): this {
    const timer = disabled ? undefined : this.s.game.settings.timer[type] ?? 5

    switch (type) {
      case 'challenge': {
        const value = challenge({})
        const text = 'Challenge'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
      case 'decline_counter': {
        const value = declineCounter({})
        const text = 'Decline Counter'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
      case 'continue_turn': {
        const value = continueTurn({})
        const text = 'Continue'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
      case 'next_turn': {
        const value = nextTurn({})
        const text = 'Next Turn'
        this.s.commands = createCommand({ value, text, timer }, disabled)
        return this
      }
    }
  }

  setupActiveMode(): this {
    delete this.s.counter
    delete this.s.challenge
    delete this.s.drawCards
    delete this.s.pickLossCard
    this.s.turnActions = {}
    this.s.active = this.s.game.player_order[this.s.turn]
    this.setCommand('challenge', { disabled: true })

    const activePlayer = this.s.players[this.s.active]
    if (this.isActivePlayer) {
      this.setActionStates({
        clickable: this.makeIsActiveActionClickable(activePlayer),
      })
    } else {
      // All actions normal for non-active players
      this.s.actionState = {}
    }
    return this
  }

  setupChallengeMode(): this {
    const action = this.latestTurnRoleAction

    if (action?.def.counter) {
      // Set the player who played the counter action as the counter player
      const pidx = action.payload.subject
      if (pidx != null) this.s.counter = [pidx]
    }

    this.setActionStates()

    const disabled =
      !this.s.userID ||
      // Disable Challenge for the player who performed the action, and
      this.getPlayer(action?.payload?.subject).id === this.s.userID ||
      // For the current player if eliminated
      this.isPlayerEliminated(this.s.userID)
    return this.setCommand('challenge', { disabled })
  }

  setupCounterMode(): this {
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
    const disabled = !this.isCounterPlayer
    this.setCommand('decline_counter', { disabled })

    this.setActionStates()

    if (this.isCounterPlayer) {
      const counterID = action?.def.id
      this.updateActionStates({
        clickable: (xdef) => xdef.counter === counterID,
      })
    }
    return this
  }

  setupDrawCard(x: BlowActionTurnInfo, cardCount: number): this {
    const cards = range(0, cardCount).map(() => this.drawCard())
    this.s.drawCards = { action: x, drawnCards: cards }
    return this
  }

  setupPickLossCard(x: BlowActionTurnInfo, cardIndex?: number): this {
    this.s.pickLossCard = { action: x }
    if (cardIndex != null) this.s.pickLossCard.cardIndex = cardIndex
    return this
  }

  shuffle(): this {
    this.s.deck = prngShuffle(this.s.deck)
    return this
  }

  /** Update the current turn's action (active/counter played) tracker */
  updateTurnActions(x: BlowAction): this {
    invariant(isBlowRoleActionID(x.type), `Action '${x.type} not a role action`)
    const def = this.toAction(x.type)
    const key = !def.counter ? 'active' : 'counter'
    this.s.turnActions[key] = { ...(this.s.turnActions[key] ?? {}), ...x, def }
    return this
  }

  updateActionStates(predicateByState: ActionStatePredicateMap): this {
    return this.setActionStates(predicateByState, { resetState: false })
  }

  private getActiveTargets(xdef: BlowRoleActionDef): number[] {
    return (
      this.playersAlive
        .filter((p) => p.index !== this.s.active)
        // If potential tarket has no coins, cannot steal from them
        .filter((p) => (xdef.targetEffect === 'steal' ? p.coins > 0 : true))
        .map((p) => p.index)
    )
  }

  private makeIsActiveActionClickable(player: BlowPlayerView) {
    return (xdef: BlowRoleActionDef): boolean => {
      // Cannot play counters as an active action
      if (xdef.counter) return false

      // If player has more than 10 coins, forced to play blow action
      if (player.coins >= 10) return xdef.id === 'activate_blow'

      // If this is a targetable action, only allow if targets are available
      if (xdef.targetEffect && this.getActiveTargets(xdef).length === 0)
        return false

      // Cannot play if player cannot affort the action
      if (xdef.coins && player.coins < xdef.coins) return false

      return true
    }
  }

  private setPickTarget(x: BlowActionTurnInfo): this {
    invariant(isBlowRoleActionID(x.type), 'Target effect must be role action')
    const action: BlowRoleAction = { type: x.type, payload: x.payload }
    const verb = x.def.name ?? 'act against'
    const className = 'text-red-600 dark:text-red-500'
    const targetText = { type: 'text' as const, value: 'target', className }
    let description: BlowLabelItem[] = []
    if (this.isActivePlayer) {
      description = [`Pick a`, targetText, `to ${verb} below`]
    } else {
      const activePlayer = this.activePlayer
      description = [
        { type: 'player', value: activePlayer ?? 'Unknown' },
        `is picking a`,
        targetText,
        `to ${verb}...`,
      ]
    }
    const targets = this.getActiveTargets(x.def)
    this.s.pickTarget = { action, description, targets }
    return this
  }
}
