import { PlayerView } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'

type Props = typeof defaultProps & {
  player: PlayerView
  label?: string
}

const defaultProps = {
  readonly: false,
}

export default function ScoreboardSpecialPlayer({
  player,
  label,
  readonly,
}: Props) {
  return (
    <div className={cx('flex-center flex flex-col', { 'mb-4': !readonly })}>
      <div className="flex-center flex w-full">
        <div
          className={cx(`
            flex items-center justify-between
            overflow-hidden whitespace-nowrap
            text-base text-amber-600 dark:text-amber-400 sm:text-lg
          `)}
        >
          <ScoreboardIcon>{player.icon}</ScoreboardIcon>
          <ScoreboardPlayerName player={player} />
        </div>
      </div>
      <span className="text-xs text-gray-500">{label?.toUpperCase()}</span>
    </div>
  )
}

ScoreboardSpecialPlayer.defaultProps = defaultProps
