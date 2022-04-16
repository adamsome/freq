import produce from 'immer'
import React, { useState } from 'react'
import invariant from 'tiny-invariant'
import { selectCards } from '../../lib/blow/blow-action-creators'
import {
  BlowCardSelection,
  BlowCardSource,
  BlowPlayerView,
  BlowRoleID,
} from '../../lib/types/blow.types'
import { Command, CommandError } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useBlowGame } from '../../lib/util/use-game'
import BlowPlayerSeat from './blow-player-seat'

type Props = {
  className?: string
  onCommandError?: (error: CommandError) => void
}

export default function BlowBoardDrawCards(props: Props) {
  const { game, mutate } = useBlowGame()
  const [selected, setSelected] = useState<BlowCardSelection[]>([])
  const [fetching, setFetching] = useState(false)

  const handleCardClick = async (
    selection: BlowCardSelection,
    done: boolean
  ) => {
    if (fetching || !game || game.drawCards?.selected) return

    const nextSelection = [...selected, selection]
    setSelected(nextSelection)
    if (!done) return

    setFetching(true)
    const value = selectCards(nextSelection)
    try {
      await postCommand(game.type, game.room, 'action', value)
      mutate(
        produce((game) => {
          if (game.drawCards) game.drawCards.selected = true
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      const message = String(data?.message ?? err?.message ?? '')
      console.error(`Error posting command 'action'.`, value, data)
      const command: Command = { type: 'action', text: 'Draw Card' }
      props.onCommandError?.({ command, data, message, date: new Date() })
    }
  }

  return (
    <BlowBoardDrawCardContent
      {...props}
      selected={selected}
      onCardClick={handleCardClick}
    />
  )
}

interface BlowBoardDrawCardContentProps {
  onCardClick: (selection: BlowCardSelection, done: boolean) => void
  selected: BlowCardSelection[]
}

function BlowBoardDrawCardContent(
  props: Props & BlowBoardDrawCardContentProps
) {
  const { game } = useBlowGame()
  if (!game?.drawCards) return null

  const {
    players,
    drawCards,
    settings: { theme },
  } = game
  const { className, selected, onCardClick } = props
  const { action, drawnCards, selected: done } = drawCards

  invariant(
    typeof action.payload.subject === 'number',
    'Draw card needs subject index'
  )

  const player = players[action.payload.subject]

  const aliveCards = player.cardsKilled.filter((k) => !k)
  const selectableCards = player.current && !done
  const targetMsg = getTargetMessage(player, done)

  const handleClick = (_: BlowRoleID, index: number, type?: BlowCardSource) => {
    if (!selectableCards) return
    invariant(type, 'Draw card click must include a source')
    const readyToSubmit = selected.length + 1 >= aliveCards.length
    onCardClick({ type, index }, readyToSubmit)
  }

  return (
    <div className={cx('flex-center flex-col', className)}>
      <BlowPlayerSeat
        player={player}
        name={player.current ? 'You' : undefined}
        actions={game.actionState}
        theme={theme}
        size="lg"
        titleSuffix={targetMsg}
        drawnCards={!done ? drawnCards : undefined}
        card={{
          color: 'cyan',
          selectable: selectableCards,
          size: 'md',
          onClick: handleClick,
        }}
        cardSelection={selected}
      />
    </div>
  )
}

function getTargetMessage(player: BlowPlayerView, done?: boolean): string {
  const aliveCards = player.cardsKilled.filter((k) => !k)
  const n = aliveCards.length === 2 ? 'two cards' : 'one card'
  if (player.current) {
    if (!done) {
      return `can pick ${n}...`
    } else {
      return `picked ${n}`
    }
  } else {
    if (!done) {
      return `is picking ${n}...`
    } else {
      return `picked ${n}`
    }
  }
}
