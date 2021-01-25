import { useState } from 'react'
import Container from '../components/container'
import GameBoard from '../components/game-board'
import { useGameWithError } from '../hooks/use-game'
import { isRoomValid } from '../lib/game'
import { joinGame } from '../lib/game-store'
import { toGameView } from '../lib/game-view'
import { GameView } from '../types/game.types'
import { SessionContext } from '../types/io.types'
import { UserConnected } from '../types/user.types'
import { head } from '../util/array'
import withSession from '../util/with-session'

type Props = typeof defaultProps & {
  cookie: string
  user: UserConnected
  game: GameView
}

const defaultProps = {}

const RoomPage = ({ cookie, user, game: initGame }: Props) => {
  const [game, error] = useGameWithError(initGame)
  const [showDebug, setShowDebug] = useState(false)

  if (error) return <div>🤷‍♀️ Sorry... ({error})</div>
  if (!game) return <div>Loading...</div>

  return (
    <Container title="Game" cookie={cookie} game={game}>
      <main>
        <GameBoard />

        <pre onClick={() => setShowDebug(!showDebug)}>
          {game.game_started_at.replace('T', ' ').slice(0, -5) + ' '}
          {user?.id?.substr(0, 8)}
          {` (${game.players.findIndex((p) => p?.id === user?.id) + 1}`}
          {`/${game.players.length})`}
        </pre>
        {showDebug && user?.connected && (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        )}
        {showDebug && <pre>{JSON.stringify(game, null, 2)}</pre>}
      </main>

      <style jsx>{`
        main {
          width: 100%;
          max-width: 800px;
          padding: var(--stack-lg) var(--inset-sm);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </Container>
  )
}

RoomPage.defaultProps = defaultProps

export const getServerSideProps = withSession(
  async ({ req, params }: SessionContext) => {
    let user: UserConnected | undefined = req.session.get('user')
    if (!user) {
      console.warn(`No 'user' param set in [room] SSR.`)
      return { redirect: { destination: '/', permanent: false } }
    }

    const room = head(params?.room as string | undefined)?.toLowerCase()

    if (!isRoomValid(room)) {
      console.warn(`No 'room' param set in [room] SSR.`)
      return { redirect: { destination: '/', permanent: false } }
    }

    // const prevRoom: string | undefined
    if (room !== user.room.toLowerCase()) {
      user = { ...user, room }
      req.session.set('user', user)
      await req.session.save()
    }

    // TODO: Pass prevRoom so joinGame can remove player from old room
    const game = await joinGame(room, user.id)

    return {
      props: {
        cookie: req.headers.cookie ?? '',
        user: req.session.get('user'),
        game: toGameView(user.id, game),
      },
    }
  }
)

export default RoomPage
