import { GetServerSideProps } from 'next'
import { v4 as uuidv4 } from 'uuid'
import Container from '../components/container'
import Meter from '../components/meter'
import { joinGame } from '../lib/game'
import { Game } from '../types/game.types'
import { head } from '../util/array'
import { getCookie } from '../util/io'
import { cookieStorageManager } from '../util/storage-manager'

type Props = typeof defaultProps & {
  cookie: string
  game: Game
  player_id: string
}

const defaultProps = {}

const GamePage = ({ cookie, game, player_id }: Props) => {
  const store = cookieStorageManager(cookie)
  const existing_player_id = store.get('freq-player-id')
  if (player_id !== existing_player_id) {
  }
  return (
    <Container title="Game" cookie={cookie} game={game}>
      <main>
        <Meter game={game} />
      </main>

      <style jsx>{`
        main {
          width: 100%;
          max-width: 800px;
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

GamePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params, req, res } = ctx
  const game_id = head(params?.game_id)
  const cookie = getCookie(req)

  if (!game_id) {
    throw new Error(`No 'game_id' param set in [game_id] SSR.`)
  }

  // Get previously persisted player ID if set
  const store = cookieStorageManager(cookie)
  let player_id = store.get('freq-player-id')
  // Create & persist unique player ID if they don't have one
  if (!player_id) {
    player_id = player_id ?? uuidv4()
    store.set('freq-player-id', player_id, { serverResponse: res })
  }

  const game = await joinGame(game_id, player_id)

  return {
    props: {
      cookie,
      game,
      player_id,
    },
  }
}

export default GamePage
