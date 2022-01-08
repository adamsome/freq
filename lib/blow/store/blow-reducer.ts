import { createSlice } from '@reduxjs/toolkit'
import {
  BlowActionState,
  BlowGame,
  BlowPlayerView,
  BlowRoleActionID,
  BlowRoleID,
} from '../../types/blow.types'
import { Command } from '../../types/game.types'
import { blowShuffle } from '../blow-random'
import { getBlowRoles } from '../blow-role'
import { BLOW_ROLE_DEFS } from '../blow-role-defs'
import { initBlowGame } from '../create-new-blow-game'

export interface BlowState {
  game: BlowGame
  userID?: string
  deck: BlowRoleID[]
  roles: BlowRoleID[]
  commands: Command[]
  actionState: Partial<Record<BlowRoleActionID, BlowActionState>>
  players: BlowPlayerView[]
  turnIndex: number
}

export const initialState: BlowState = {
  game: initBlowGame(),
  deck: [],
  roles: [],
  commands: [],
  actionState: {},
  players: [],
  turnIndex: 0,
}

const blowSlice = createSlice({
  name: 'blow',
  initialState,
  reducers: {
    prep(state) {
      state.roles = getBlowRoles(state.game.settings.variant) as BlowRoleID[]

      state.deck = state.roles
        .map((id) => BLOW_ROLE_DEFS[id])
        .filter((r) => !r.common)
        .flatMap((r) => [r.id, r.id, r.id])

      const disabled = state.game.players.length < 3
      state.commands = [{ type: 'begin_round', text: 'Deal Cards', disabled }]

      state.players = state.game.players.map((p, i) => ({
        ...p,
        active: state.game.player_order[0] === i,
        current: p.id === state.userID,
        wins: state.game.stats?.[p.id]?.w,
        cards: [],
        coins: 2,
      }))
    },
    shuffle(state) {
      state.deck = blowShuffle(state.deck)
    },
    deal(state) {
      for (let handIndex = 0; handIndex < 2; handIndex++) {
        state.game.players.forEach((_, playerIndex) => {
          const card = state.deck.pop()
          if (!card) throw new Error('Unexected Error: Deck ran out of cards')

          const player = state.players[playerIndex]
          if (!player) throw new Error('Unexected Error: Player at index empty')

          if (!player.cards) player.cards = []
          player.cards[handIndex] = card
        })
      }
    },
  },
})

const { actions, reducer } = blowSlice
export const { prep, shuffle, deal } = actions
export default reducer
