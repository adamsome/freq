import { getGameTitle } from '../../lib/game'
import { cx } from '../../lib/util/dom'
import { useFetchUser } from '../../lib/util/use-fetch-user'
import { useResGame } from '../../lib/util/use-game'
import GameJoinButtons from '../game-join-buttons'
import Layout from '../layout/layout'

export default function ResContainer() {
  const { game } = useResGame()
  const { user } = useFetchUser()
  const { room } = game ?? {}

  const currentPlayer = game?.players.find((p) => p.id === user?.id)

  return (
    <Layout
      type="res"
      title={getGameTitle('res')}
      room={room}
      className="bg-white text-black dark:bg-black dark:text-white"
      contentClassName="[--freq-button-weight:600]"
      button={{
        color: 'phosphorus',
        className: 'inline-flex font-spaced-medium',
      }}
      sticky
      flexWrapper={false}
    >
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
        Res ({currentPlayer?.name ?? 'No Player'})
        {!currentPlayer && game?.room && (
          <GameJoinButtons
            room={game.room}
            className=""
            button={{}}
            fullHeight
          />
        )}
      </div>
    </Layout>
  )
}
