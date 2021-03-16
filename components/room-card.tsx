import { formatDistanceWithOptions, formatISO9075, parseISO } from 'date-fns/fp'
import React from 'react'
import { GameView } from '../types/game.types'
import { cx } from '../util/dom'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps & {
  game: GameView
  onClick: (room: string) => void
}

const defaultProps = {
  className: '',
}

const formatDate = formatDistanceWithOptions({ addSuffix: true })

export default function RoomCard({ game, className, onClick }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    onClick?.(game.room)
  }

  const timestamp = game.round_started_at ?? game.game_started_at
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
      <div
        className={cx(
          'flex items-center w-full min-w-full overflow-hidden',
          'px-4 md:px-0 pb-3 mb-3 transition-colors',
          'border-b border-gray-100 dark:border-gray-800',
          'group-hover:border-gray-200 dark:group-hover:border-gray-700'
        )}
      >
        <h2
          className={cx(
            'flex flex-1 items-center',
            'text-2xl md:text-3xl font-light whitespace-nowrap',
            'transition-colors group-hover:text-blue-600',
            'whitespace-nowrap overflow-hidden overflow-ellipsis'
          )}
        >
          {game.room}

          <div
            title={lastUpdatedISO}
            className={cx(
              'flex-1 ml-4 text-gray-500 text-sm md:text-base text-left',
              'whitespace-nowrap overflow-hidden overflow-ellipsis'
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

      <div className="w-full pr-2 md:pr-0 opacity-70 group-hover:opacity-100 transition-opacity">
        <Scoreboard game={game} readonly></Scoreboard>
      </div>
    </button>
  )
}

RoomCard.defaultProps = defaultProps
