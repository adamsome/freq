import { createSlice } from '@reduxjs/toolkit'
import { addSeconds } from 'date-fns/fp'
import { doesGameHaveEnoughPlayers } from '../game'
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
import { activateIncome, challenge, nextTurn } from './blow-action-creators'
import { getBlowRoles } from './blow-role'
import { BLOW_ROLE_ACTIONS_DEFS } from './blow-role-action-defs'
import { BLOW_ROLE_DEFS } from './blow-role-defs'
import initBlowGame from './init-blow-game'

export interface BlowState {
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

export const initialState: BlowState = {
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

const blowSlice = createSlice({
  name: 'blow',
  initialState,
  reducers: {
    prep(state) {
      state.roles = getBlowRoles(state.game.settings.variant) as BlowRoleID[]
      state.order = state.game.player_order

      // Establish deck of cards, three of each role
      state.deck = state.roles
        .map((rid) => BLOW_ROLE_DEFS[rid])
        .filter((role) => !role.common)
        .flatMap((role) => [role.id, role.id, role.id])

      // Set command to Deal Cards & enable if enough players
      const disabled = !doesGameHaveEnoughPlayers(state.game, 'blow')
      state.commands = [{ type: 'begin_round', text: 'Deal Cards', disabled }]

      // Init player view w/ an empty hand, 2 coins, & metadata
      state.players = state.game.players.map((p) => ({
        ...p,
        wins: state.game.stats?.[p.id]?.w,
        cards: [],
        coins: 2,
      }))
    },
    shuffle(state) {
      addMessage(state, 'Shuffling cards', { as: '__dealer' })

      state.deck = prngShuffle(state.deck)
    },
    deal(state) {
      const text = `Dealing cards to ${state.game.players.length} players`
      addMessage(state, text, { as: '__dealer' })

      // Deal two cards from the deck to each player
      for (let idx = 0; idx < 2; idx++) {
        state.game.players.forEach((_, pidx) => {
          const role = state.deck.pop()
          if (!role) throw new Error('Unexected Error: Deck ran out of cards')

          const p = state.players[pidx]
          if (!p) throw new Error('Unexected Error: Player at index empty')

          if (!p.cards) p.cards = []
          p.cards[idx] = role
        })
      }

      state.turn = 0
      setActiveState(state)
    },
    finalize(state) {
      state.players.forEach((p, pidx) => {
        // Set all players hands facedown for non-current players
        if (state.game.phase !== 'prep' && p.id !== state.userID) {
          p.cards = [null, null]
        }
        // Set player statuses
        if (p.id === state.userID) p.current = true
        if (pidx === state.active) p.active = true
        if (pidx === state.counter) p.counter = true
      })
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(challenge, (state, action) => {
        console.error('challenge', state, action)
        throw new Error('Challenge not yet implemented')
      })
      .addCase(nextTurn, (state) => {
        state.turn = (state.turn + 1) % state.order.length
        setActiveState(state)
      })
      .addCase(activateIncome, (state, action) => {
        addMessage(state, `Plays ${getActionDef(action)?.name}`)

        if (canChallenge(action)) {
          // TODO: implement challenge sequence
          console.log('can-challenge', action)
          return
        }
        if (canCounter(state, action)) {
          // TODO: implement counter sequence
          console.log('can-counter', action)
          return
        }

        // Resolve action

        setActionState(state, { active: (xdef) => xdef.id === action.type })

        // Action-specific
        getActionSubject(state, action).coins++

        setTimerAndCommand(state, 'next-turn')
      }),
})

const createCommand = (
  command: Partial<Command>,
  // action: BlowAction,
  // text: string,
  status?: 'enabled' | 'disabled'
) => {
  const cmd: Command = { type: 'action', text: '', ...command }
  if (status) cmd.disabled = status === 'enabled' ? false : true
  return [cmd]
}

const createChallengeCommand = (status?: 'enabled' | 'disabled') => {
  return createCommand({ value: challenge({}), text: 'Challenge' }, status)
}

const createNextTurnCommand = (status?: 'enabled' | 'disabled') => {
  return createCommand({ value: nextTurn({}), text: 'Continue' }, status)
}

const setActionState = (
  state: BlowState,
  predicateByState: Partial<
    Record<
      BlowActionState,
      (xdef: BlowRoleActionDef, role: BlowRoleDef) => unknown
    >
  >
) => {
  state.actionState = {}
  state.roles.forEach((rid) => {
    const role = BLOW_ROLE_DEFS[rid]
    role.actions.forEach((xid) => {
      const xdef = BLOW_ROLE_ACTIONS_DEFS[xid]

      const statePredicates = Object.entries(predicateByState)
      statePredicates.forEach(([actionState, predicate]) => {
        if (predicate(xdef, role)) {
          state.actionState[xid] = actionState as BlowActionState
        }
      })
    })
  })
  return null
}

const getActionSubject = (
  state: BlowState,
  action: BlowAction
): BlowPlayerView => {
  const player = state.players.find((p) => p.id === action.payload.subject)
  if (!isPlayer(player)) throw new Error('No action subject player found')
  return player
}

const getActionDef = (x: BlowAction): BlowRoleActionDef | undefined => {
  return BLOW_ROLE_ACTIONS_DEFS[x.type as BlowRoleActionID]
}

const addMessage = (
  state: BlowState,
  text: string,
  { as }: { as?: string | number } = {}
): void => {
  const date = new Date().toISOString()
  const msg: BlowMessage = { date, text }
  if (as) {
    msg.subject = as
  } else {
    const i = state.counter ?? state.active
    if (i != null) msg.subject = i
  }
  state.messages.push(msg)
}

const setTimerAndCommand = (
  state: BlowState,
  type: BlowTimerType,
  status?: 'enabled' | 'disabled'
): void => {
  const s = state.game.settings.timer[type] ?? 5
  const ends = addSeconds(s, new Date()).toISOString()
  state.timer = { type, ends }

  switch (type) {
    case 'challenge': {
      state.commands = createChallengeCommand(status)
    }
    case 'next-turn': {
      state.commands = createNextTurnCommand(status)
    }
  }
}

const canAffordAction = (p: BlowPlayerView, x: BlowRoleActionDef): boolean =>
  (p.coins ?? 0) >= (x.coins ?? 0)

const canChallenge = (x: BlowAction): boolean =>
  x.payload.role != null && !BLOW_ROLE_DEFS[x.payload.role].common

const canCounter = (state: BlowState, x: BlowAction): boolean =>
  // Cannot counter a counter
  !getActionDef(x)?.counter &&
  // Change if any of the matches' roles' actions can counter this action
  state.roles.some((rid) => {
    const role = BLOW_ROLE_DEFS[rid]
    role.actions.some((xid) => {
      const xdef = BLOW_ROLE_ACTIONS_DEFS[xid]
      return xdef.counter === x.type
    })
  })

const setActiveState = (state: BlowState) => {
  delete state.timer
  delete state.counter
  state.active = state.order[state.turn]
  state.commands = createChallengeCommand('disabled')

  const activePlayer = state.players[state.active]
  const isCurrentPlayerActive = activePlayer?.id === state.userID
  if (isCurrentPlayerActive) {
    const mustBlow = activePlayer.coins >= 10
    setActionState(state, {
      clickable: (xdef) =>
        mustBlow
          ? xdef.id === 'activate_blow'
          : !xdef.counter && canAffordAction(activePlayer, xdef),
    })
  } else {
    // All actions normal for non-active players
    state.actionState = {}
  }
}

const { actions, reducer } = blowSlice
export const { prep, shuffle, deal, finalize } = actions
export default reducer
