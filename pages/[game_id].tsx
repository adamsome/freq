import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Container, { getServerSideCookie } from '../components/container'
import Meter from '../components/meter'
import { Game } from '../types/game.types'
import { head } from '../util/array'

function createGame(game_id?: string): Game | undefined {
  if (game_id) {
    return {
      game_id,
    }
  }
}

type Props = typeof defaultProps & {
  cookie: string
}

const defaultProps = {}

const GamePage = ({ cookie }: Props) => {
  const router = useRouter()
  const { game_id } = router.query
  const game = createGame(head(game_id))

  return (
    <Container title="Game" cookie={cookie} game={game}>
      <main>
        <Meter game={game} />
      </main>

      <style jsx>{`
        main {
          padding: var(--stack-lg) var(--inset-lg);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return getServerSideCookie(ctx)
}

GamePage.defaultProps = defaultProps

export default GamePage
