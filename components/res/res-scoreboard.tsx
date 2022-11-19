import React from 'react'
import { getResPlayersInOrder } from '../../lib/res/res-engine'
import { useResGame } from '../../lib/util/use-game'
import ResScoreboardRow from './res-scoreboard-row'

export default function ResScoreboard() {
  const { game } = useResGame()
  if (!game) return null

  const players = getResPlayersInOrder(game)

  return (
    <div className="font-spaced-medium w-full text-lg">
      {players.map((p) => (
        <ResScoreboardRow key={p.id} player={p} />
      ))}
    </div>
  )
}
