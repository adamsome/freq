import { createSlice } from '@reduxjs/toolkit'
import { doesGameHaveEnoughPlayers } from '../game'
import { BlowRoleID } from '../types/blow.types'
import { activateIncome, challenge, nextTurn } from './blow-action-creators'
import { getBlowRoles } from './blow-role'
import { getBlowRoleActionDef } from './blow-role-action-defs'
import { getBlowRoleDef } from './blow-role-defs'
import BlowState, { initialBlowState } from './blow-state'

const blowSlice = createSlice({
  name: 'blow',
  initialState: initialBlowState,
  reducers: {
    prep(state) {
      state.roles = getBlowRoles(state.game.settings.variant) as BlowRoleID[]
      state.order = state.game.player_order

      // Establish deck of cards, three of each role
      state.deck = state.roles
        .map((rid) => getBlowRoleDef(rid))
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
      new BlowState(state)
        .addMessage('Shuffling cards', { as: '__dealer' })
        .shuffle()
    },
    deal(state) {
      const text = `Dealing cards to ${state.game.players.length} players`
      new BlowState(state)
        .addMessage(text, { as: '__dealer' })
        .deal()
        .setTurn(0)
        .setActive()
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
        new BlowState(state).incrementTurn().setActive()
      })
      .addCase(activateIncome, (state, action) => {
        const s = new BlowState(state)

        s.addMessage(`Plays ${getBlowRoleActionDef(action)?.name}`)

        if (s.canChallenge(action)) {
          // TODO: implement challenge sequence
          console.log('can-challenge', action)
          return
        }
        if (s.canCounter(action)) {
          // TODO: implement counter sequence
          console.log('can-counter', action)
          return
        }

        // Resolve action

        s.setActionStates({ active: (xdef) => xdef.id === action.type })
          .setTimerAndCommand('next-turn')
          // Action-specific
          .addCoins(action.payload.subject, 1)
      }),
})

const { actions, reducer } = blowSlice
export const { prep, shuffle, deal, finalize } = actions
export default reducer
