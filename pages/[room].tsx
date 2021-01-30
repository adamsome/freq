import { useRouter } from 'next/router'
import Container from '../components/container'
import GameBoard from '../components/game-board'
import { useGameWithError } from '../hooks/use-game'
import { joinGame } from '../lib/game-store'
import { isRoomValid } from '../lib/room'
import { GameView } from '../types/game.types'
import { SessionContext } from '../types/io.types'
import { UserConnected } from '../types/user.types'
import { head } from '../util/array'
import withSession, { createUserSession } from '../util/with-session'

type Props = typeof defaultProps & {
  cookie: string
  game: GameView
  roomUrl?: string
}

const defaultProps = {}

const RoomPage = ({ cookie, game: initGame, roomUrl }: Props) => {
  const [game, error] = useGameWithError(initGame)
  const router = useRouter()

  const msg = error
    ? error?.data?.message ?? error?.message ?? String(error)
    : ''
  if (error) {
    console.error('Game state error', msg, { error })
    router.push(`/?error=${msg}`)
  }

  return (
    <Container title={game?.room} cookie={cookie} game={game}>
      <main>
        {error && <label className="error">🤷‍♀️ Sorry... ({msg})</label>}
        {!game && <label>Loading...</label>}
        {game && <GameBoard roomUrl={roomUrl} />}
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

        label {
          display: block;
          text-align: center;
          color: var(--subtle);
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
    const name = head(params?.name as string | undefined)

    if (!isRoomValid(room)) {
      const msg =
        `Room code '${room}' is invalid. ` +
        'Must be two words separated by a dash.'
      console.warn(msg)
      req.session.destroy()
      return { redirect: { destination: `/?error=${msg}`, permanent: false } }
    }

    if (!user) {
      try {
        user = await createUserSession(req, room, name)
      } catch (error) {
        console.error('Error logging in:', error)
        req.session.destroy()
        return { redirect: { destination: '/', permanent: false } }
      }
    }

    let prevRoom: string | undefined
    if (room !== user.room.toLowerCase()) {
      prevRoom = user.room
      user = { ...user, room }
      req.session.set('user', user)
      await req.session.save()
    }

    const game = await joinGame(room, user, prevRoom)

    const roomUrl = `${process.env.BASE_URL}/${room}`

    return {
      props: {
        cookie: req.headers.cookie ?? '',
        game,
        roomUrl,
      },
    }
  }
)

export default RoomPage
