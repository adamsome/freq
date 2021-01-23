import { GetServerSideProps } from 'next'
import { useState } from 'react'
import Container from '../components/container'
import GameBoard from '../components/game-board'
import { joinGame } from '../lib/game-store'
import { createGameView } from '../lib/game-view'
import { isRoomValid } from '../lib/room'
import { GameView } from '../types/game.types'
import { UserConnected } from '../types/user.types'
import { head } from '../util/array'
import withSession from '../util/with-session'

type Props = typeof defaultProps & {
  cookie: string
  user: UserConnected
  game: GameView
}

const defaultProps = {}

const RoomPage = ({ cookie, user, game }: Props) => {
  const [showDebug, setShowDebug] = useState(false)
  return (
    <Container title="Game" cookie={cookie} game={game}>
      <main>
        <GameBoard player_id={user.player_id} game={game} />

        <pre onClick={() => setShowDebug(!showDebug)}>
          {game.game_started_at.replace('T', ' ').slice(0, -5) + ' '}
          {user?.player_id?.substr(0, 8)}
          {' ('}
          {game.players.findIndex((p) => p?.player_id === user?.player_id) + 1}
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

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, params }) => {
    let user: UserConnected | undefined = req.session.get('user')
    if (!user) {
      console.warn(`No 'user' param set in [room] SSR.`)
      return { redirect: { destination: '/', permanent: false } }
    }

    const room = head(params?.room)

    if (!isRoomValid(room)) {
      console.warn(`No 'room' param set in [room] SSR.`)
      return { redirect: { destination: '/', permanent: false } }
    }

    // const prevRoom: string | undefined
    if (room !== user.room) {
      user = { ...user, room }
      req.session.set('user', user)
      await req.session.save()
    }

    // TODO: Pass prevRoom so joinGame can remove player from old room
    const game = await joinGame(room, user.player_id)

    return {
      props: {
        cookie: req.headers.cookie ?? '',
        user: req.session.get('user'),
        game: createGameView(user.player_id, game),
      },
    }
  }
)

export default RoomPage
