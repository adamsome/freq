import { getGameTitle } from '../lib/game'
import { BaseGameView, GameType } from '../lib/types/game.types'
import RepoLink from './control/repo-link'
import HomeGames from './home-games'
import Layout from './layout/layout'
import LayoutMain from './layout/layout-main'
import RoomList from './room-list'

type Props = typeof defaultProps & {
  gameType?: GameType
  gameTypeLoading?: boolean
  userLoading?: boolean
  generatedRoom?: string
  rooms?: BaseGameView[]
  onGameChange: (gameType?: GameType) => void
  onRoomClick: (game: BaseGameView) => void
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
  onGameChange,
  onRoomClick,
  onRoomsRefresh,
}: Props) {
  const title = getGameTitle(gameType)

  return (
    <Layout
      big
      title={title ?? 'Games'}
      onLogoClick={() => onGameChange(undefined)}
    >
      <LayoutMain>
        <HomeGames
          gameType={gameType}
          loading={gameTypeLoading}
          generatedRoom={generatedRoom}
          onGameChange={onGameChange}
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
