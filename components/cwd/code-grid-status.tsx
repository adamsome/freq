import { getTeamColor } from '../../lib/color-dict'
import { getTeamName } from '../../lib/game'
import { getTeamIcon } from '../../lib/icon'
import { CwdLastAct } from '../../lib/types/cwd.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'
import { styleColor } from '../../lib/util/dom-style'
import useConditionalDebounce from '../../lib/util/use-conditional-debounce'
import SkeletonBox from '../skeleton-box'

type Props = typeof defaultProps & {
  winner?: 1 | 2
  turn?: 1 | 2
  guess?: CwdLastAct
}

const defaultProps = {}

export default function CodeGridStatus({
  winner: rawWinner,
  turn: rawTurn,
  guess,
}: Props) {
  // Scratch code reveals slow, whereas correct guesses reveal fast
  const debounceTime = () =>
    guess?.state === -1 ? 5000 : guess?.correct ? 200 : 2000

  const turn = useConditionalDebounce(rawTurn, { debounceTime })
  const winner = useConditionalDebounce(rawWinner, { debounceTime })

  if (!turn && !winner) return <SkeletonBox className="w-full h-8 px-0" />

  const team = winner ?? turn
  const color = getTeamColor(team)
  const name = getTeamName(team)
  const icon = getTeamIcon(team)
  const text = winner ? `${name} team wins!` : `${name} is guessing...`

  return (
    <div
      className={cx(
        'bg-gray-100 dark:bg-gray-950',
        'text-base sm:text-lg font-mono font-bold',
        'w-full px-2 sm:px-4 py-0.5 sm:py-1',
        { 'text-center': winner }
      )}
      style={styleColor(color, winner ? 1 : 0)}
    >
      {winner && range(0, 3).map((_, i) => <span key={i}>{icon}</span>)}
      <span className={cx({ 'mx-2': winner })}>{text}</span>
      {winner && range(0, 3).map((_, i) => <span key={i}>{icon}</span>)}
    </div>
  )
}

CodeGridStatus.defaultProps = defaultProps
