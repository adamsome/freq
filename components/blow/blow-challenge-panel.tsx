import produce from 'immer'
import React, { useState } from 'react'
import { revealChallengeCard } from '../../lib/blow/blow-action-creators'
import { BlowPlayerView, BlowRoleID } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import BlowPlayerLabel from './blow-player-label'
import BlowPlayerSeat from './blow-player-seat'
import BlowRoleLabel from './blow-role-label'

type Props = {
  className?: string
}

export default function BlowChallengePanel(props: Props) {
  const { game, mutate } = useBlowGame()
  const [selected, setSelected] = useState<number | undefined>(undefined)
  const [fetching, setFetching] = useState(false)

  const handleCardClick = async (role: BlowRoleID, cardIndex: number) => {
    if (fetching || !game) return
    setSelected(cardIndex)
    setFetching(true)

    const value = revealChallengeCard({ role, cardIndex })

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
    <BlowChallengeContent
      {...props}
      selected={selected}
      onCardClick={handleCardClick}
    />
  )
}

interface BlowChallengeContentProps {
  onCardClick: (rid: BlowRoleID, index: number) => void
  selected?: number
}

function BlowChallengeContent(props: Props & BlowChallengeContentProps) {
  const { game } = useBlowGame()
  if (!game?.challenge) return null

  const { players, challenge } = game
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
  const handleClick = selectableCards ? onCardClick : undefined

  return (
    <div className={cx('flex-center flex-col', className)}>
      <div className="text-center font-spaced-narrow text-cyan-500 text-xs">
        CHALLENGE
      </div>

      <div className="xs:mb-1 text-xl">
        <LitPlayerLabel
          className="mr-1"
          player={challenger}
          lit={winner === 'challenger'}
        />
        <span className="text-gray-400 italic">vs.</span>
        <LitPlayerLabel
          className="ml-2"
          player={target}
          lit={winner === 'target'}
        />
      </div>

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
        cardSelected={cardSelected}
      />

      {!winner && <BlowChallengeDescription />}
    </div>
  )
}

type LitPlayerLabelProps = Props & { player: BlowPlayerView; lit?: boolean }

function LitPlayerLabel({ className, player, lit }: LitPlayerLabelProps) {
  return (
    <BlowPlayerLabel
      className={cx(
        'mr-1',
        lit && 'pl-1.5 pr-0.5 py-0 font-light text-black bg-cyan-400 rounded',
        className
      )}
      value={player}
    />
  )
}

// TODO: Use `BlowLabel` to render
function BlowChallengeDescription({ className }: Props) {
  const { game } = useBlowGame()
  if (!game?.challenge) return null

  const { players, challenge } = game

  const target = players[challenge.target]

  return (
    <div
      className={cx(
        'max-w-xs',
        'text-center',
        'font-narrow',
        'text-gray-400 dark:text-gray-500 text-sm',
        className
      )}
    >
      <BlowPlayerLabel
        className="mr-1 text-gray-500 dark:text-gray-400"
        value={target}
      />
      <span className="mr-1">must prove that they actually have </span>
      <BlowRoleLabel
        className="mr-0.5 text-gray-500 dark:text-gray-400"
        value={game.challenge.role}
      />
      <span> in their hand or they lose a life.</span>
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
          return 'lost a life'
        default:
          return 'must reveal a card...'
      }
    } else {
      switch (winner) {
        case 'target':
          return 'won & drew a new card'
        case 'challenger':
          return 'lost a life'
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
          return 'lost a life'
      }
    } else {
      switch (winner) {
        case 'target':
          return 'lost & is revealing a card'
        default:
          return 'lost a life'
      }
    }
  }
}
