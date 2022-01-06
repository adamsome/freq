import { getGameTitle } from '../../lib/game'
import useGame from '../../lib/util/use-game'
import GameLink from '../game-link'
import Layout from '../layout/layout'
import LayoutMain from '../layout/layout-main'
import BlowCardBoard from './blow-card-board'
import BlowPlayersSheet from './blow-players-sheet'

type Props = typeof defaultProps

const defaultProps = {}

export default function BlowGameBoard(_: Props) {
  const { game } = useGame()

  const type = 'blow'
  const title = getGameTitle(type)
  const roomUrl =
    type && game && `${process.env.NEXT_PUBLIC_BASE_URL}/${type}/${game.room}`

  return (
    <Layout
      className="[--freq-button-weight:400]"
      type={type}
      title={title}
      room={game?.room}
      button={{
        color: 'cyan',
        className: 'inline-flex font-spaced-narrow font-light',
      }}
    >
      <LayoutMain>
        {game?.phase === 'prep' && (
          <GameLink url={roomUrl} button={{ color: 'cyan', bgHover: false }} />
        )}

        <BlowCardBoard />
        <BlowPlayersSheet />
      </LayoutMain>
    </Layout>
  )
}

BlowGameBoard.defaultProps = defaultProps
