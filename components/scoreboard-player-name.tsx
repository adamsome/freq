import { GameType, Player } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'

type Props = typeof defaultProps & {
  type?: GameType
  player: Player
}

const defaultProps = {
  right: false,
  psychic: false,
  nextPsychic: false,
}

export default function ScoreboardPlayerName({
  type,
  player,
  right,
  psychic,
  nextPsychic,
}: Props) {
  const icon = type === 'cwd' ? '👁' : '🧠'
  return (
    <>
      <div
        className={cx(
          'flex-1 flex items-center overflow-hidden',
          'overflow-ellipsis whitespace-nowrap text-center',
          { 'flex-row-reverse': right }
        )}
      >
        <div
          className={cx(
            'flex-initial overflow-hidden overflow-ellipsis whitespace-nowrap',
            right
              ? 'text-right mr-0 ml-1 sm:ml-2'
              : 'text-left mr-1 sm:mr-2 ml-0',
            { 'font-semibold': player.leader }
          )}
        >
          {`${player.name ?? 'Unnamed'}`}
        </div>

        {psychic && <div className="text-lg sm:text-xl">{icon}</div>}
        {nextPsychic && <div className="text-xs sm:text-sm">{icon}</div>}
      </div>
    </>
  )
}

ScoreboardPlayerName.defaultProps = defaultProps
