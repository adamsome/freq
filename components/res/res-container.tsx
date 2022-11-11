import produce from 'immer'
import { useState } from 'react'
import { Player } from '../../lib/types/game.types'
import { ResAction } from '../../lib/types/res.types'
import { cx } from '../../lib/util/dom'
import { postCommand } from '../../lib/util/fetch-json'
import { useResGame } from '../../lib/util/use-game'
import GameJoinButtons from '../game-join-buttons'
import ResBoard from './res-board'
import ResLayout from './res-layout'

export default function ResContainer() {
  const { game, mutate } = useResGame()
  const [rawFetching, setFetching] = useState(false)
  const fetching = game?.fetching != null || rawFetching

  async function handlePlayerSelect(player: Player): Promise<void> {
    if (fetching || !game) return
    console.log('select', player)
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
      <div
        className={cx(`
          mx-auto w-full
          max-w-screen-md
          space-y-1.5 pt-1.5
          xs:space-y-2 xs:pt-2
          sm:space-y-4 sm:pt-4
          md:px-2
        `)}
      >
        <ResBoard onPlayerSelect={handlePlayerSelect} />

        {!game?.currentPlayer && game?.room && (
          <GameJoinButtons
            room={game.room}
            className=""
            button={{}}
            fullHeight
          />
        )}
      </div>
    </ResLayout>
  )
}
