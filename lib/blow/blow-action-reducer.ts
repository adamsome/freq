import { createSlice } from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
import {
  challenge,
  continueTurn,
  declineCounter,
  isBlowRoleAction,
  nextTurn,
  revealChallengeCard,
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
        .setActiveMode()
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
        s.setTimerCommand('continue-turn', true)
      })
      .addCase(revealChallengeCard, (state, action) => {
        const s = new BlowState(state)

        const { cardIndex } = action.payload
        invariant(cardIndex != null, 'Need card index to handle reveal')
        const challenge = state.challenge
        invariant(challenge, 'Need challenge to handle reveal')

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

        s.setTimerCommand('continue-turn')
      })
      .addCase(continueTurn, (state, _action) => {
        const s = new BlowState(state)

        if (state.challenge) {
          if (state.challenge.challengerLoss || state.winner) {
            // Done w/ challenge
            delete state.challenge
            s.processRoleActions()
          } else if (state.challenge.winner === 'target') {
            // Challenge target won challenge, challenger now must lose card
            state.challenge.challengerLoss = true

            s.setTimerCommand('continue-turn', true)

            const pidx = state.challenge.challenger
            const lastRemaining = s.getLastRemainingPlayerCardIndex(pidx)
            if (lastRemaining != null) {
              // Challenger has only one card left: reveal it automatically
              state.challenge.challengerCardIndex = lastRemaining
              s.setTimerCommand('continue-turn')
            }
          } else {
            // Challenge target lost challenge
            const latestRoleAction = s.latestTurnRoleAction
            invariant(latestRoleAction, 'No turn role action')
            if (!latestRoleAction.def.counter) {
              // Active action challenged successfully, next turn
              s.incrementTurn().setActiveMode()
            } else {
              // Counter action challenged successfully, continue active action
              delete state.challenge
              s.processRoleActions()
            }
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
        }
      })
      .addCase(nextTurn, (state) => {
        new BlowState(state).incrementTurn().setActiveMode()
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
