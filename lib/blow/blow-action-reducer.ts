import { createSlice } from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
import { BlowCardSource, BlowRoleID } from '../types/blow.types'
import { allNonNil } from '../util/array'
import {
  challenge,
  continueTurn,
  declineCounter,
  isBlowRoleAction,
  nextTurn,
  revealCard,
  selectCards,
} from './blow-action-creators'
import BlowState, { initialBlowState } from './blow-state'

const blowSlice = createSlice({
  name: 'blow',
  initialState: initialBlowState,
  reducers: {
    init(state) {
      new BlowState(state).init()
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
        .setupActiveMode()
    },
    finalize(state) {
      new BlowState(state).finalize()
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(challenge, (state, action) => {
        const s = new BlowState(state)

        const latestRoleAction = s.latestTurnRoleAction
        invariant(latestRoleAction, 'No turn role action')

        latestRoleAction.hadChallengeOpportunity = true

        if (action.payload.expired) {
          if (latestRoleAction.def.counter) {
            invariant(state.turnActions.active, 'Counter requires active')
            state.turnActions.active.countered = true
          }
          s.processRoleActions()
          return
        }

        // Initiate the challenge
        const challenger = action.payload.subject
        const target = latestRoleAction?.payload.subject
        const role = latestRoleAction?.payload.role

        const hasProps = challenger != null && target != null && role
        invariant(hasProps, `Missing challenge properties`)

        state.challenge = { challenger, target, role }
        s.setCommand('continue_turn', { disabled: true })
      })
      .addCase(revealCard, (state, action) => {
        const s = new BlowState(state)

        const { cardIndex } = action.payload
        invariant(cardIndex != null, 'Need card index to handle reveal')

        const challenge = state.challenge
        if (challenge) {
          if (!challenge.challengerLoss) {
            const target = s.getPlayer(challenge.target)
            const cardRevealed = target.cards[cardIndex]
            invariant(cardRevealed, 'Need revealed card to handle reveal')

            // Handle the challenge target revealing card
            challenge.cardIndex = cardIndex

            if (cardRevealed === challenge.role) {
              // Handle the challenge target winning the challenge
              challenge.winner = 'target'

              // Give the winning challenge target a new card
              state.deck.push(cardRevealed)
              s.shuffle()
              target.cards[cardIndex] = s.drawCard()

              // If target was the counter action, active action now countered
              const latestRoleAction = s.latestTurnRoleAction
              invariant(latestRoleAction, 'No turn role action')
              if (latestRoleAction.def.counter) {
                invariant(state.turnActions.active, 'Counter requires active')
                state.turnActions.active.countered = true
              }
            } else {
              // Handle the challenge target losing the challenge
              challenge.winner = 'challenger'
              // Flip over the losing challenge target's chosen card
              target.cardsKilled[cardIndex] = true
            }
          } else {
            // Handle the challenger who lost revealing their card
            challenge.challengerCardIndex = cardIndex
            // Flip over the losing challenge challenger's chosen card
            const challenger = s.getPlayer(challenge.challenger)
            challenger.cardsKilled[cardIndex] = true
          }
        } else if (state.pickLossCard) {
          // Handle a target who was killed picking the card to kill
          state.pickLossCard.cardIndex = cardIndex
          // Flip over the target's chosen card
          const target = s.getPlayer(state.pickLossCard.action.payload.target)
          target.cardsKilled[cardIndex] = true
          // This happens at the very end of the turn
          s.setCommand('next_turn')
          return
        }

        s.setCommand('continue_turn')
      })
      .addCase(continueTurn, (state, _action) => {
        const s = new BlowState(state)

        if (
          state.challenge?.challengerLoss ||
          state.winner ||
          state.pickLossCard
        ) {
          delete state.challenge
          delete state.pickLossCard
          s.processRoleActions()
          return
        }

        if (state.challenge?.winner === 'target') {
          // Challenge target won challenge, challenger now must lose card
          state.challenge.challengerLoss = true

          s.setCommand('continue_turn', { disabled: true })

          const pidx = state.challenge.challenger
          const lastRemaining = s.getLastRemainingPlayerCardIndex(pidx)
          if (lastRemaining != null) {
            // Challenger has only one card left: reveal it automatically
            state.challenge.challengerCardIndex = lastRemaining
            s.setCommand('continue_turn')
          }
        } else if (state.challenge?.winner === 'challenger') {
          // Challenge target lost challenge
          const latestRoleAction = s.latestTurnRoleAction
          invariant(latestRoleAction, 'No turn role action')
          if (!latestRoleAction.def.counter) {
            // Active action challenged successfully, next turn
            s.incrementTurn().setupActiveMode()
          } else {
            // Counter action challenged successfully, continue active action
            delete state.challenge
            s.processRoleActions()
          }
        }
      })
      .addCase(declineCounter, (state, action) => {
        const s = new BlowState(state)

        const { active } = state.turnActions
        invariant(active, 'Need action active to counter')

        active.countersDeclined = (active.countersDeclined ?? 0) + 1

        const counterPlayers = state.counter ?? []
        if (
          action.payload.expired ||
          active.countersDeclined === counterPlayers.length
        ) {
          s.processRoleActions()
        } else if (
          active.countersDeclined <= counterPlayers.length &&
          s.getPlayer(action.payload.subject).id === state.userID
        ) {
          // Player declined, but still waiting on other counter players
          s.setActionStates()
          state.commands[0].text = 'Waiting for others...'
          state.commands[0].disabled = true
          state.commands[0].allowExpiredWhenDisabled = true
        }
      })
      .addCase(selectCards, (state, action) => {
        const s = new BlowState(state)
        const player = s.activePlayer
        invariant(player, 'Need active player to select cards')
        invariant(state.drawCards, 'Need to be drawing cards to select cards')

        const drawn = state.drawCards.drawnCards
        const prev = player.cards
        const selected = action.payload
        invariant(allNonNil(drawn), 'Drawn cards cannot be empty')
        invariant(allNonNil(prev), 'Player cards cannot be empty')

        // Prepare the players next cards, keeping faceup ones in place
        const next: (BlowRoleID | null)[] = prev.map((c, i) =>
          player.cardsKilled[i] ? c : null
        )
        const discard: BlowRoleID[] = []

        // Of the drawn cards and current hand cards, determine from the active
        // player's selection which should be kept, and which discarded
        const partitionIntoKeepOrDiscard = (type: BlowCardSource) => {
          return (c: BlowRoleID, index: number) => {
            if (type === 'hand' && player.cardsKilled[index] === true) {
              // Keep faceup cards in the hand where they are currently
              next[index] = c
              return
            }
            if (selected.find((s) => s.type === type && s.index === index)) {
              // Put the selected card in the next available hand spot
              const i = next[0] == null ? 0 : 1
              next[i] = c
              return
            }
            discard.push(c)
          }
        }

        drawn.forEach(partitionIntoKeepOrDiscard('drawn'))
        prev.forEach(partitionIntoKeepOrDiscard('hand'))

        // Put the selected cards in the active player's hand
        player.cards = next

        // Put non-selected cards back in the deck and shuffle
        discard.forEach((c) => state.deck.push(c))
        s.shuffle()

        state.drawCards.selected = true
        s.setCommand('next_turn')
      })
      .addCase(nextTurn, (state) => {
        new BlowState(state).incrementTurn().setupActiveMode()
      })
      .addMatcher(isBlowRoleAction, (state, action) => {
        new BlowState(state)
          .updateTurnActions(action)
          .addMessage()
          .processRoleActions()
      }),
})

const { actions, reducer } = blowSlice
export const { init, shuffle, deal, finalize } = actions
export default reducer
