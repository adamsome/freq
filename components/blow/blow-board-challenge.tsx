import produce from 'immer'
import React, { useState } from 'react'
import { revealCard } from '../../lib/blow/blow-action-creators'
import {
  BlowLabelDef,
  BlowPlayerView,
  BlowRoleID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardTitle from './blow-board-title'
import BlowLabel from './tokens/blow-label'
import BlowPlayerSeat from './blow-player-seat'

type Props = {
  className?: string
}

export default function BlowBoardChallenge(props: Props) {
  const { game, mutate } = useBlowGame()
  const [selected, setSelected] = useState<number | undefined>(undefined)
  const [fetching, setFetching] = useState(false)

  const handleCardClick = async (role: BlowRoleID, cardIndex: number) => {
    if (fetching || !game) return
    setSelected(cardIndex)
    setFetching(true)

    const value = revealCard({ role, cardIndex })

    try {
      await postCommand(game.type, game.room, 'action', value)
      mutate(
        produce((game) => {
          if (game.challenge) game.challenge.cardIndex = cardIndex
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      console.error(`Error posting command 'action'.`, value, data)
    }
  }

  return (
    <BlowBoardChallengeContent
      {...props}
      selected={selected}
      onCardClick={handleCardClick}
    />
  )
}

interface BlowBoardChallengeContentProps {
  onCardClick: (rid: BlowRoleID, index: number) => void
  selected?: number
}

function BlowBoardChallengeContent(
  props: Props & BlowBoardChallengeContentProps
) {
  const { game } = useBlowGame()
  if (!game?.challenge) return null

  const {
    players,
    challenge,
    settings: { theme },
  } = game
  const { className, selected, onCardClick } = props
  const { winner, cardIndex, challengerLoss, challengerCardIndex } = challenge

  const challenger = players[challenge.challenger]
  const target = players[challenge.target]

  let player: BlowPlayerView
  if (!challengerLoss) {
    // Initial challenge phase where target is selecting a card
    if (winner === 'target' && !target.current) {
      // When target wins, other players should see their revealed card
      const cards = [...target.cards]
      cards[cards[0] == null ? 0 : 1] = challenge.role
      player = { ...target, cards }
    } else {
      player = target
    }
  } else {
    player = challenger
  }

  const selectableCards = challengerLoss
    ? challenger.current && challengerCardIndex == null
    : target.current && cardIndex == null

  let cardSelected: number | undefined
  if (!challengerLoss && target.current) {
    cardSelected = selected ?? cardIndex
  }

  const msgResult = !challengerLoss
    ? winner
    : challengerCardIndex == null
    ? 'target'
    : undefined
  const targetMsg = getTargetMessage(player, msgResult, challengerLoss)
  const label: BlowLabelDef = [
    { type: 'player', value: target },
    'must prove that they actually have',
    { type: 'role', value: game.challenge.role },
    'in their hand or they lose a life.',
  ]
  const handleClick = selectableCards ? onCardClick : undefined

  return (
    <div className={cx('flex-center flex-col', className)}>
      <BlowBoardTitle
        title="CHALLENGE"
        player={[challenger, target]}
        playerSeparator="vs."
        selected={winner === 'challenger' ? 0 : winner === 'target' ? 1 : null}
      />

      <BlowPlayerSeat
        className="mb-1"
        player={player}
        name={player.current ? 'You' : undefined}
        actions={game.actionState}
        theme={theme}
        size="lg"
        titleSuffix={targetMsg}
        card={{
          color: 'cyan',
          selectable: selectableCards,
          onClick: handleClick,
        }}
        cardSelection={cardSelected}
      />

      {!winner && (
        <div
          className={cx(`
            max-w-xs
            text-center font-narrow text-sm
            text-gray-400 dark:text-gray-500
          `)}
        >
          <BlowLabel label={label} theme={theme} />
        </div>
      )}
    </div>
  )
}

function getTargetMessage(
  player: BlowPlayerView,
  winner?: 'target' | 'challenger',
  isChallenger?: boolean
): string {
  if (!isChallenger) {
    if (player.current) {
      switch (winner) {
        case 'target':
          return 'won & drew a new card'
        case 'challenger':
          return player.cardsKilled.every(Boolean)
            ? 'were eliminated'
            : 'lost a life'
        default:
          return 'must reveal a card...'
      }
    } else {
      switch (winner) {
        case 'target':
          return 'won & drew a new card'
        case 'challenger':
          return player.cardsKilled.every(Boolean)
            ? 'was eliminated'
            : 'lost a life'
        default:
          return 'is revealing a card...'
      }
    }
  } else {
    if (player.current) {
      switch (winner) {
        case 'target':
          return 'lost & must reveal a card...'
        default:
          return player.cardsKilled.every(Boolean)
            ? 'were eliminated'
            : 'lost a life'
      }
    } else {
      switch (winner) {
        case 'target':
          return 'lost & is revealing a card'
        default:
          return player.cardsKilled.every(Boolean)
            ? 'was eliminated'
            : 'lost a life'
      }
    }
  }
}
