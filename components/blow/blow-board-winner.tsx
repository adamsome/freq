import React from 'react'
import { cx } from '../../lib/util/dom'
import { useBlowGame } from '../../lib/util/use-game'
import BlowBoardTitle from './blow-board-title'
import BlowPlayerSeat from './blow-player-seat'

type Props = {
  className?: string
}

export default function BlowBoardWinner(props: Props) {
  const { game } = useBlowGame()
  if (!game?.winner) return null

  const {
    winner: player,
    settings: { theme },
  } = game
  const { className } = props

  return (
    <div className={cx('flex-center flex-col', className)}>
      <BlowBoardTitle title="WINNER" player={player} selected={true} />

      <BlowPlayerSeat
        className="mb-1"
        player={player}
        name={player.current ? 'You' : undefined}
        actions={game.actionState}
        theme={theme}
        size="lg"
        titleSuffix={'won the match!'}
        card={{ color: 'cyan' }}
      />
    </div>
  )
}
