import { GameType, Player } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'

type Props = Partial<typeof defaultProps> & {
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
  right = defaultProps.right,
  psychic = defaultProps.psychic,
  nextPsychic = defaultProps.nextPsychic,
}: Props) {
  const icon = type === 'cwd' ? '👁' : '🧠'
  return (
    <>
      <div
        className={cx(
          `flex flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-center ${right ? 'flex-row-reverse' : ''} `
        )}
      >
        <div
          className={cx(
            'flex-initial overflow-hidden text-ellipsis whitespace-nowrap',
            right
              ? 'ml-1 mr-0 text-right sm:ml-2'
              : 'ml-0 mr-1 text-left sm:mr-2',
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
