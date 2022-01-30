import { getGameTitle, isTeamGuessGame } from '../lib/game'
import { GameType } from '../lib/types/game.types'
import useGame from '../lib/util/use-game'
import CommandPanel from './command-panel'
import CodesContainer from './cwd/codes-container'
import CwdSettings from './cwd/cwd-settings'
import CluesContainer from './freq/clues-container'
import FreqSettings from './freq/freq-settings'
import GameJoinButtons from './game-join-buttons'
import GameLink from './game-link'
import HeaderMessage from './header-message'
import Layout from './layout/layout'
import LayoutMain from './layout/layout-main'
import SkeletonBox from './layout/skeleton-box'
import PlayerHero from './player-hero'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps & {
  type?: GameType
}

const defaultProps = {}

export default function TeamGameBoard({ type }: Props) {
  const { game } = useGame()

  const title = getGameTitle(type)
  const roomUrl =
    type && game && `${process.env.NEXT_PUBLIC_BASE_URL}/${type}/${game.room}`

  return (
    <Layout type={type} title={title} room={game?.room}>
      <LayoutMain>
        {type === 'freq' && <HeaderMessage />}

        {game?.phase === 'prep' && (
          <>
            <GameLink className="mt-6 mb-6" url={roomUrl} />

            {game.currentPlayer && (
              <>
                <PlayerHero />
                {type === 'freq' && <FreqSettings />}
                {type === 'cwd' && <CwdSettings />}
              </>
            )}
          </>
        )}

        {!type ? (
          <SkeletonBox className="mb-4 h-32 w-full sm:mb-5 sm:h-40 md:px-4" />
        ) : type === 'freq' ? (
          <CluesContainer />
        ) : type === 'cwd' ? (
          <CodesContainer />
        ) : (
          <div>Not Yet Implemented.</div>
        )}

        {isTeamGuessGame(type) && (
          <>
            {!game ? (
              <SkeletonBox className="mb-6 h-14 w-full md:px-4" />
            ) : game.currentPlayer ? (
              <CommandPanel />
            ) : (
              <GameJoinButtons room={game.room} />
            )}

            <Scoreboard game={game} />
          </>
        )}
      </LayoutMain>
    </Layout>
  )
}

TeamGameBoard.defaultProps = defaultProps
