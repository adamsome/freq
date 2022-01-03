import { formatDistanceWithOptions, formatISO9075, parseISO } from 'date-fns/fp'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { isTeamGuessGame } from '../lib/game'
import { BaseGameView } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import Scoreboard from './scoreboard'
import Title from './title'

type Props = typeof defaultProps & {
  game: BaseGameView
  onClick: (game: BaseGameView) => void
}

const defaultProps = {
  className: '',
}

const formatDate = formatDistanceWithOptions({ addSuffix: true })

export default function RoomCard({ game, className, onClick }: Props) {
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    onClick?.(game)
  }

  const timestamp =
    game.round_started_at ?? game?.match_started_at ?? game?.room_started_at

  let lastUpdatedISO = ''
  let lastUpdated = ''

  if (timestamp) {
    const date = parseISO(timestamp)
    lastUpdated = formatDate(new Date(), date)
    lastUpdatedISO = formatISO9075(date)
  }

  return (
    <button
      type="button"
      className={cx(
        'flex flex-col items-center w-full',
        'px-0 md:px-4 py-3 bg-gray-100 dark:bg-gray-900',
        'border-t border-b border-gray-200 dark:border-gray-800',
        'md:border-l md:border-r md:rounded-lg',
        'transition cursor-pointer group',
        'hover:bg-blue-100 dark:hover:bg-blue-950',
        'hover:border-blue-400 dark:hover:border-blue-800',
        'focus:ring-4 focus:ring-blue-400 focus:ring-opacity-25',
        'dark:focus:ring-blue-500 dark:focus:ring-opacity-25',
        'focus:outline-none focus:border-blue-700 dark:focus:border-blue-700',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center w-full min-w-full overflow-hidden px-4 md:px-0">
        <h2
          className={cx(
            'flex flex-1 items-center',
            'text-2xl md:text-3xl font-light whitespace-nowrap',
            'transition-colors group-hover:text-blue-600',
            'whitespace-nowrap overflow-hidden text-ellipsis'
          )}
        >
          <Title type={game.type} small />

          <div className="text-gray-300 dark:text-gray-700 font-light ml-2 mr-1.5">
            /
          </div>

          {game.room}

          <div
            title={lastUpdatedISO}
            className={cx(
              'hidden sm:block font-light',
              'flex-1 ml-4 text-gray-500 text-sm md:text-base text-left',
              'whitespace-nowrap overflow-hidden text-ellipsis'
            )}
          >
            {lastUpdated}
          </div>
        </h2>

        <div
          className={cx(
            'text-gray-300 dark:text-gray-700 text-3xl font-light',
            'transition-colors group-hover:text-blue-600'
          )}
        >
          →
        </div>
      </div>

      <div
        title={lastUpdatedISO}
        className={cx(
          'block sm:hidden font-light self-start',
          'flex-1 ml-4 text-gray-500 text-sm md:text-base text-left',
          'whitespace-nowrap overflow-hidden text-ellipsis'
        )}
      >
        {lastUpdated}
      </div>

      <div
        className={cx(
          'w-full pr-2 md:pr-0 opacity-70 group-hover:opacity-100 transition-opacity',
          'pt-3 mt-3 transition-colors',
          'border-t border-gray-300 dark:border-gray-800',
          'group-hover:border-gray-300 dark:group-hover:border-gray-700'
        )}
      >
        {isTeamGuessGame(game.type) ? (
          <Scoreboard game={game} readonly></Scoreboard>
        ) : (
          <div>Scores not yet implemented.</div>
        )}
      </div>
    </button>
  )
}

type SkeletonProps = typeof defaultSkeletonProps

const defaultSkeletonProps = {
  className: '',
}

export function RoomCardSkeleton({ className }: SkeletonProps) {
  return (
    <button
      type="button"
      className={cx(
        'w-full h-40',
        'bg-gray-50 dark:bg-gray-950',
        'animate-shine bg-gradient-to-r bg-skeleton bg-no-repeat',
        'from-gray-50 via-white to-gray-50',
        'dark:from-gray-950 dark:via-gray-900 dark:to-gray-950',
        'border-t border-b border-transparent',
        'md:border-l md:border-r md:rounded-lg',
        'focus:outline-none cursor-default',
        className
      )}
    ></button>
  )
}

RoomCard.defaultProps = defaultProps
