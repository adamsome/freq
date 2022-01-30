import { formatDistanceWithOptions, formatISO9075, parseISO } from 'date-fns/fp'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { isTeamGuessGame } from '../lib/game'
import { BaseGameView } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import Scoreboard from './scoreboard'
import Title from './control/title'
import { isBlowGameView } from '../lib/blow/blow-game-view'
import BlowPlayerSeatsGrid from './blow/blow-player-seats-grid'

type Props = typeof defaultProps & {
  game: BaseGameView
  onClick: (game: BaseGameView) => void
}

const defaultProps = {
  className: '',
}

const formatDateDistance = formatDistanceWithOptions({ addSuffix: true })

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
    lastUpdated = formatDateDistance(new Date(), date)
    lastUpdatedISO = formatISO9075(date)
  }

  const isTeamGame = isTeamGuessGame(game.type)
  const isBlowGame = isBlowGameView(game)

  return (
    <button
      type="button"
      className={cx(`
        group flex w-full cursor-pointer flex-col items-center
        border-t border-b border-gray-200 bg-gray-100
        px-0 ${isBlowGame ? 'pt-3 pb-1' : 'py-3'}
        transition
        hover:border-blue-400
        hover:bg-blue-100
        focus:border-blue-700
        focus:outline-none
        focus:ring-4
        focus:ring-blue-400
        focus:ring-opacity-25
        dark:border-gray-800
        dark:bg-gray-900
        dark:hover:border-blue-800
        dark:hover:bg-blue-950
        dark:focus:border-blue-700
        dark:focus:ring-blue-500
        dark:focus:ring-opacity-25
        md:rounded-lg md:border-l md:border-r
        md:px-4
        ${className}
      `)}
      onClick={handleClick}
    >
      <div className="flex w-full min-w-full items-center overflow-hidden px-4 md:px-0">
        <h2
          className={cx(`
            flex flex-1 items-center
            overflow-hidden text-ellipsis whitespace-nowrap
            text-2xl font-light
            transition-colors
            group-hover:text-blue-600
            md:text-3xl
          `)}
        >
          <Title type={game.type} small />

          <div className="ml-2 mr-1.5 font-light text-gray-300 dark:text-gray-700">
            /
          </div>

          {game.room}

          <div
            title={lastUpdatedISO}
            className={cx(`
              ml-4
              hidden flex-1
              overflow-hidden text-ellipsis whitespace-nowrap
              text-left text-sm font-light text-gray-500
              sm:block
              md:text-base
            `)}
          >
            {lastUpdated}
          </div>
        </h2>

        <div
          className={cx(`
            text-3xl font-light text-gray-300 transition-colors
            group-hover:text-blue-600 dark:text-gray-700
          `)}
        >
          →
        </div>
      </div>

      <div
        title={lastUpdatedISO}
        className={cx(`
          ml-4
          block flex-1 self-start
          overflow-hidden text-ellipsis whitespace-nowrap
          text-left text-sm font-light
          text-gray-500
          sm:hidden
          md:text-base
        `)}
      >
        {lastUpdated}
      </div>

      <div
        className={cx(`
          mt-3 w-full
          border-t border-gray-300
          pr-2 ${isBlowGame ? 'pt-1' : 'pt-3'}
          opacity-70 transition
          group-hover:border-gray-300 group-hover:opacity-100
          dark:border-gray-800 dark:group-hover:border-gray-700
          md:pr-0
        `)}
      >
        {isTeamGame ? (
          <Scoreboard game={game} readonly></Scoreboard>
        ) : isBlowGame ? (
          <BlowPlayerSeatsGrid className="m-auto" game={game} />
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
      className={cx(`
        h-40 w-full
        animate-shine cursor-default
        border-t border-b border-transparent
        bg-gray-50 bg-gradient-to-r from-gray-50 via-white to-gray-50
        bg-skeleton bg-no-repeat
        focus:outline-none
        dark:bg-gray-950 dark:from-gray-950
        dark:via-gray-900 dark:to-gray-950
        md:rounded-lg md:border-l md:border-r
        ${className}
      `)}
    ></button>
  )
}

RoomCard.defaultProps = defaultProps
