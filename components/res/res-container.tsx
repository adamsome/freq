import produce from 'immer'
import { useState } from 'react'
import { Player } from '../../lib/types/game.types'
import { ResAction } from '../../lib/types/res.types'
import { postCommand } from '../../lib/util/fetch-json'
import { useResGame } from '../../lib/util/use-game'
import ResBoard from './res-board'
import ResBoardPrep from './res-board-prep'
import ResLayout from './res-layout'

export default function ResContainer() {
  const { game, mutate } = useResGame()
  const [rawFetching, setFetching] = useState(false)
  const fetching = game?.fetching != null || rawFetching

  if (!game) return <div>Loading...</div>

  const prep = game.phase === 'prep'
  const roomUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/res/${game.room}`

  async function handlePlayerSelect(player: Player): Promise<void> {
    if (fetching || !game) return
    setFetching(true)
    try {
      const payload = player.id
      const action: ResAction = { type: 'select_team_player', payload }
      await postCommand(game.type, game.room, 'action', action)
      mutate(
        produce((game) => {
          if (game) game.fetching = true
        }, game)
      )
    } catch (err) {
      const data = err?.data ?? err
      console.error(`Error selecting mission team player.`, data)
    }
    setFetching(false)
  }

  return (
    <ResLayout>
      {prep ? (
        <ResBoardPrep roomUrl={roomUrl} />
      ) : (
        <ResBoard onPlayerSelect={handlePlayerSelect} />
      )}
    </ResLayout>
  )
}
