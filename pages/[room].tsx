import Container from '../components/container'
import GameBoard from '../components/game-board'
import { useGameWithError } from '../hooks/use-game'
import { isRoomValid } from '../lib/game'
import { joinGame } from '../lib/game-store'
import { GameView } from '../types/game.types'
import { SessionContext } from '../types/io.types'
import { UserConnected } from '../types/user.types'
import { head } from '../util/array'
import withSession, { createUserSession } from '../util/with-session'

type Props = typeof defaultProps & {
  cookie: string
  game: GameView
}

const defaultProps = {}

const RoomPage = ({ cookie, game: initGame }: Props) => {
  const [game, error] = useGameWithError(initGame)

  if (error) return <div>🤷‍♀️ Sorry... ({error})</div>
  if (!game) return <div>Loading...</div>

  return (
    <Container title="Game" cookie={cookie} game={game}>
      <main>
        <GameBoard />
      </main>

      <style jsx>{`
        main {
          width: 100%;
          max-width: 40rem;
          padding: var(--stack-md) var(--inset-sm);
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

    const room = head(params?.room as string | undefined)?.toLowerCase()

    if (!room) {
      console.warn(`No 'room' param set in [room] SSR.`)
      return { redirect: { destination: '/', permanent: false } }
    }

    if (!user) {
      try {
        user = await createUserSession(req, room)
      } catch (error) {
        console.error('Error logging in:', error)
        return { redirect: { destination: '/', permanent: false } }
      }
    }

    if (!isRoomValid(room)) {
      console.warn(`No 'room' param set in [room] SSR.`)
      return { redirect: { destination: '/', permanent: false } }
    }

    let prevRoom: string | undefined
    if (room !== user.room.toLowerCase()) {
      prevRoom = user.room
      user = { ...user, room }
      req.session.set('user', user)
      await req.session.save()
    }

    const game = await joinGame(room, user.id, prevRoom)

    return {
      props: {
        cookie: req.headers.cookie ?? '',
        game,
      },
    }
  }
)

export default RoomPage
