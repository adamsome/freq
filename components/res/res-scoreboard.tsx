import React from 'react'
import { getResPlayersInOrder } from '../../lib/res/res-engine'
import { range } from '../../lib/util/array'
import { useResGame } from '../../lib/util/use-game'
import ResScoreboardRow from './res-scoreboard-row'

export default function ResScoreboard() {
  const { game } = useResGame()
  if (!game) return null

  const players = getResPlayersInOrder(game)

  return (
    <div className="font-spaced-medium w-full text-lg">
      {range(10).map((i) => (
        <ResScoreboardRow
          key={players[i]?.id ?? i}
          player={players[i]}
          index={i}
        />
      ))}
    </div>
  )
}
