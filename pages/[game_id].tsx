import { GetServerSideProps } from 'next'
import { v4 as uuidv4 } from 'uuid'
import Container from '../components/container'
import GameBoard from '../components/game-board'
import { joinGame } from '../lib/game'
import { createGameView } from '../lib/game-view'
import { GameView } from '../types/game.types'
import { head } from '../util/array'
import { cookieStorageManager } from '../util/storage-manager'

type Props = typeof defaultProps & {
  cookie: string
  player_id: string
  game: GameView
}

const defaultProps = {}

const GamePage = ({ cookie, player_id, game }: Props) => {
  return (
    <Container title="Game" cookie={cookie} game={game}>
      <main>
        <GameBoard player_id={player_id} game={game} />
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

GamePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params, req, res } = ctx
  const game_id = head(params?.game_id)
  const cookie = req.headers.cookie ?? ''

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
      player_id,
      game: createGameView(player_id, game),
    },
  }
}

export default GamePage
