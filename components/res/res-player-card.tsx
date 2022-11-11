import React from 'react'
import { Player } from '../../lib/types/game.types'
import { ResVoteStatus } from '../../lib/types/res.types'
import { cx } from '../../lib/util/dom'

type Props = {
  player: Player
  lead?: boolean
  current?: boolean
  spy?: boolean
  selected?: boolean
  selectable?: boolean
  voteStatus?: ResVoteStatus
  onSelect: (player: Player) => void
}

export default function ResPlayerCard({
  player,
  lead,
  current,
  spy,
  selected,
  selectable,
  voteStatus,
  onSelect,
}: Props) {
  return (
    <div
      className={cx(
        'flex flex-col border p-2',
        selected ? 'border-phosphorus-500' : 'border-gray-700',
        selectable && 'cursor-pointer',
        selectable &&
          (selected ? 'hover:border-phosphorus-700' : 'hover:border-gray-500')
      )}
      onClick={() => selectable && onSelect(player)}
    >
      <div>{player.name}</div>
      {current && <div className="text-blue-500">You</div>}
      {lead && <div className="text-phosphorus-500">Lead</div>}
      {spy && <div className="text-red-500">Spy</div>}
      {voteStatus && <div>{voteStatus}</div>}
    </div>
  )
}
