import { GameType } from '../lib/types/game.types'
import Heading from './control/heading'
import Title from './control/title'
import GamePicker from './game-picker'
import RoomFormContainer from './room-form-container'

type Props = typeof defaultProps & {
  gameType?: GameType
  loading?: boolean
  generatedRoom?: string
  onGameChange: (gameType?: GameType) => void
}

const defaultProps = {}

export default function HomeGames({
  gameType,
  loading,
  generatedRoom,
  onGameChange,
}: Props) {
  return (
    <div className="flex h-full flex-col justify-center">
      {!loading && !gameType && (
        <div className="mb-3.5 flex flex-col items-center justify-center pt-12">
          <Heading className="flex-center pl-0 text-center">
            Choose Game
          </Heading>
          <GamePicker horizontal onClick={onGameChange} />
        </div>
      )}

      {!loading && gameType && (
        <>
          <Title
            classNames="mt-9 border-2 border-transparent"
            type={gameType}
            animate={true}
          />

          <div className="flex h-24 flex-col justify-center px-6 sm:px-24 md:my-4">
            <p className="text-center text-xl">
              Type an existing game&apos;s name to join or just click Start to
              create a new game.
            </p>
          </div>

          <RoomFormContainer
            classNames="mt-3"
            generatedRoom={generatedRoom}
            type={gameType}
            onChangeGameClick={() => onGameChange()}
          />
        </>
      )}
    </div>
  )
}

HomeGames.defaultProps = defaultProps
