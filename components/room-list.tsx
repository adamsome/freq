import { BaseGameView } from '../lib/types/game.types'
import { range } from '../lib/util/array'
import { cx } from '../lib/util/dom'
import Button from './control/button'
import Heading from './control/heading'
import IconSvg from './control/icon-svg'
import RoomCard, { RoomCardSkeleton } from './room-card'

type Props = typeof defaultProps & {
  rooms?: BaseGameView[]
  onRoomClick: (game: BaseGameView) => void
  onRefresh?: () => void
}

const defaultProps = {
  classNames: '',
  loading: false,
  error: null as null | string,
}

export default function RoomList({
  rooms,
  loading,
  error,
  classNames,
  onRoomClick,
  onRefresh,
}: Props) {
  return (
    <>
      <Heading classNames={classNames}>
        <span>Recent Games</span>
        <span className="flex-1"></span>
        <Button
          className={cx('text-base ml-4', { 'text-right': loading })}
          gray
          disabled={loading}
          bg={false}
          onClick={onRefresh}
        >
          {loading ? (
            <IconSvg
              name="spinner"
              className="w-5 h-5 text-black dark:text-white"
            />
          ) : (
            'Refresh'
          )}
        </Button>
      </Heading>

      {error != null && (
        <p className="mb-8 self-start text-left text-xl text-red-700">
          {String(error)}
        </p>
      )}

      {rooms == null &&
        error == null &&
        range(0, 2).map((_, i) => (
          <RoomCardSkeleton key={i} className="mb-6 md:mb-8" />
        ))}

      {rooms && rooms.length === 0 && (
        <p
          className={cx(
            'w-full text-center text-xl p-8 rounded',
            'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-950'
          )}
        >
          No recents games available &mdash; start a new game above!
        </p>
      )}

      {rooms &&
        rooms.map((game) => (
          <RoomCard
            key={`${game.type}_${game.room}`}
            game={game}
            className="mb-6 md:mb-8"
            onClick={onRoomClick}
          ></RoomCard>
        ))}
    </>
  )
}

RoomList.defaultProps = defaultProps
