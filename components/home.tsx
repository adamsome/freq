import { getGameTitle } from '../lib/game'
import { CommonGameView, GameType } from '../lib/types/game.types'
import HomeGames from './home-games'
import Layout from './layout'
import LayoutMain from './layout-main'
import RepoLink from './repo-link'
import RoomList from './room-list'

type Props = typeof defaultProps & {
  gameType?: GameType
  gameTypeLoading?: boolean
  userLoading?: boolean
  generatedRoom?: string
  rooms?: CommonGameView[]
  onGameClick: (gameType?: GameType) => void
  onRoomClick: (game: CommonGameView) => void
  onRoomsRefresh?: () => void
}

const defaultProps = {
  roomsLoading: false,
  roomsError: null as null | string,
}

export default function Home({
  gameType,
  gameTypeLoading,
  userLoading,
  generatedRoom,
  rooms,
  roomsLoading,
  roomsError,
  onGameClick,
  onRoomClick,
  onRoomsRefresh,
}: Props) {
  const title = getGameTitle(gameType)
  const otherType = gameType
    ? ((gameType === 'freq' ? 'cwd' : 'freq') as GameType)
    : undefined

  return (
    <Layout
      big
      type={otherType}
      title={title ?? 'Games'}
      onLogoClick={() => onGameClick(undefined)}
      onTitleClick={() => onGameClick(otherType)}
    >
      <LayoutMain>
        <HomeGames
          gameType={gameType}
          loading={gameTypeLoading}
          generatedRoom={generatedRoom}
          onGameClick={onGameClick}
        />

        {!userLoading && (roomsLoading || roomsError || rooms != null) && (
          <RoomList
            classNames="mt-12"
            rooms={rooms}
            loading={roomsLoading}
            error={roomsError}
            onRoomClick={onRoomClick}
            onRefresh={onRoomsRefresh}
          />
        )}

        <RepoLink classNames="mt-8" />
      </LayoutMain>
    </Layout>
  )
}

Home.defaultProps = defaultProps
