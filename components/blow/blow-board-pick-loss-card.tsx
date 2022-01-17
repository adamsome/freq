import produce from 'immer'
import React, { useState } from 'react'
import invariant from 'tiny-invariant'
import { revealCard } from '../../lib/blow/blow-action-creators'
import { BlowPlayerView, BlowRoleID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardTitle from './blow-board-title'
import BlowPlayerSeat from './blow-player-seat'

type Props = {
  className?: string
}

export default function BlowBoardPickLossCard(props: Props) {
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
          if (game.pickLossCard) game.pickLossCard.cardIndex = cardIndex
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      console.error(`Error posting command 'action'.`, value, data)
    }
  }

  return (
    <BlowBoardPickLossCardContent
      {...props}
      selected={selected}
      onCardClick={handleCardClick}
    />
  )
}

interface BlowBoardPickLossCardContentProps {
  onCardClick: (rid: BlowRoleID, index: number) => void
  selected?: number
}

function BlowBoardPickLossCardContent(
  props: Props & BlowBoardPickLossCardContentProps
) {
  const { game } = useBlowGame()
  if (!game?.pickLossCard) return null

  const { players, pickLossCard } = game
  const { className, selected, onCardClick } = props
  const { action, cardIndex } = pickLossCard

  invariant(
    typeof action.payload.subject === 'number',
    'Pick loss card needs subject index'
  )
  invariant(
    typeof action.payload.target === 'number',
    'Pick loss card needs target index'
  )

  const active = players[action.payload.subject]
  const player = players[action.payload.target]

  const selectableCards = player.current && cardIndex == null
  const cardSelected = selected ?? cardIndex
  const targetMsg = getTargetMessage(player, cardIndex)

  const handleClick = selectableCards ? onCardClick : undefined

  return (
    <div className={cx('flex-center flex-col', className)}>
      <BlowBoardTitle
        title={action.def.name?.toUpperCase() ?? 'TARGET'}
        player={[active, player]}
        playerSeparator="killed"
      />

      <BlowPlayerSeat
        className="mb-1"
        player={player}
        name={player.current ? 'You' : undefined}
        actions={game.actionState}
        size="lg"
        titleSuffix={targetMsg}
        card={{
          color: 'cyan',
          selectable: selectableCards,
          onClick: handleClick,
        }}
        cardSelection={cardSelected}
      />
    </div>
  )
}

function getTargetMessage(player: BlowPlayerView, cardIndex?: number): string {
  if (player.current) {
    if (cardIndex == null) {
      return 'must reveal a card...'
    } else {
      return player.cardsKilled.every(Boolean)
        ? 'were eliminated'
        : 'lost a life'
    }
  } else {
    if (cardIndex == null) {
      return 'is revealing a card...'
    } else {
      return player.cardsKilled.every(Boolean)
        ? 'was eliminated'
        : 'lost a life'
    }
  }
}
