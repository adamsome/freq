import { GameType } from '../types/game.types'
import GamePicker from './game-picker'
import RoomFormContainer from './room-form-container'
import Title from './title'

type Props = typeof defaultProps & {
  gameType?: GameType
  loading?: boolean
  generatedRoom?: string
  onGameClick: (gameType?: GameType) => void
}

const defaultProps = {}

export default function HomeGames({
  gameType,
  loading,
  generatedRoom,
  onGameClick,
}: Props) {
  return (
    <div className="h-80 flex flex-col justify-center">
      {!loading && !gameType && (
        <div className="flex flex-col justify-center items-center mb-3.5">
          <GamePicker onClick={onGameClick} />
          <p className="mx-4 mt-4 sm:mt-8 text-xl text-center">
            Choose a game.
          </p>
        </div>
      )}

      {!loading && gameType && (
        <>
          <Title
            classNames="mt-9 border-2 border-transparent"
            type={gameType}
            animate={true}
          />

          <div className="flex flex-col justify-center h-24 px-6 sm:px-24">
            <p className="text-xl text-center">
              Type an existing game&apos;s name to join or just click Start to
              create a new game.
            </p>
          </div>

          <RoomFormContainer
            classNames="mt-3"
            generatedRoom={generatedRoom}
            type={gameType}
          />
        </>
      )}
    </div>
  )
}

HomeGames.defaultProps = defaultProps
