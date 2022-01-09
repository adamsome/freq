import { createSlice } from '@reduxjs/toolkit'
import { doesGameHaveEnoughPlayers } from '../game'
import {
  BlowActionState,
  BlowGame,
  BlowMessage,
  BlowPlayerView,
  BlowRoleActionDef,
  BlowRoleActionID,
  BlowRoleID,
} from '../types/blow.types'
import { Command } from '../types/game.types'
import { prngShuffle } from '../util/prng'
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
        current: p.id === state.userID,
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

      state.commands = createChallengeCommand('disabled')
      state.turn = 0
      state.active = state.order[state.turn]

      const activePlayer = state.players[state.active]
      const isCurrentPlayerActive = activePlayer?.id === state.userID
      if (isCurrentPlayerActive) {
        // Mark active actions that the player can afford clickable
        state.roles.forEach((rid) => {
          const role = BLOW_ROLE_DEFS[rid]
          role.actions.forEach((xid) => {
            const x = BLOW_ROLE_ACTIONS_DEFS[xid]
            if (!x.counter && canAffordAction(activePlayer, x)) {
              state.actionState[xid] = 'clickable'
            }
          })
        })
      }
    },
  },
})

const createChallengeCommand = (status?: 'enabled' | 'disabled') => {
  const cmd: Command = { type: 'action', text: 'Challenge' }
  if (status) cmd.disabled = status === 'enabled' ? false : true
  return [cmd]
}

const addMessage = (
  state: BlowState,
  text: string,
  { as }: { as?: string | number } = {}
): void => {
  const date = new Date().toISOString()
  const msg: BlowMessage = { date, text }
  if (as) msg.subject = as
  state.messages.push(msg)
}

const canAffordAction = (p: BlowPlayerView, x: BlowRoleActionDef): boolean =>
  (p.coins ?? 0) >= (x.coins ?? 0)

const { actions, reducer } = blowSlice
export const { prep, shuffle, deal } = actions
export default reducer
