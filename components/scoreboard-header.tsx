import { getTeamName } from '../lib/game'
import { getTeamIcon } from '../lib/icon'
import { cx } from '../lib/util/dom'
import ScoreboardIcon from './scoreboard-icon'

type Props = typeof defaultProps & {
  scores?: readonly [number, number]
}

const defaultProps = {
  readonly: false,
}

export default function ScoreboardHeader({ scores, readonly }: Props) {
  if (!scores) return null

  const [score1, score2] = scores

  const icon1 = getTeamIcon(1)
  const icon2 = getTeamIcon(2)
  const team1 = getTeamName(1)
  const team2 = getTeamName(2)

  return (
    <div
      className={cx(
        'flex justify-between items-baseline w-full px-2',
        'font-black border-b border-black dark:border-white',
        'text-2xl whitespace-nowrap'
      )}
    >
      {!readonly && <ScoreboardIcon xl>{icon1}</ScoreboardIcon>}
      {!readonly && <div className="w-20 whitespace-nowrap">{team1}</div>}
      <div className="flex-1 text-center text-3xl">
        {score1} &mdash; {score2}
      </div>
      {!readonly && (
        <div className="w-20 whitespace-nowrap text-right">{team2}</div>
      )}
      {!readonly && (
        <ScoreboardIcon xl right>
          {icon2}
        </ScoreboardIcon>
      )}
    </div>
  )
}

ScoreboardHeader.defaultProps = defaultProps
