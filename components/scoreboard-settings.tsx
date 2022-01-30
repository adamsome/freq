import { ScoreType } from '../lib/types/game.types'
import Button from './control/button'

type Props = typeof defaultProps & {
  onTypeToggle: (scoreType: ScoreType) => void
}

const defaultProps = {
  scoreType: 'wins' as ScoreType,
}

export default function ScoreboardSettings({ scoreType, onTypeToggle }: Props) {
  const isWins = scoreType === 'wins'
  return (
    <div className="flex-center my-3 w-full sm:text-lg">
      <div className="flex-center rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
        <Button
          className="mr-0.5 w-20 text-sm sm:text-base"
          color="gray"
          variant={isWins && 'solid'}
          onClick={() => onTypeToggle('wins')}
        >
          Wins
        </Button>
        <Button
          className="ml-0.5 w-20 text-sm sm:text-base"
          color="gray"
          variant={!isWins && 'solid'}
          onClick={() => onTypeToggle('points')}
        >
          Points
        </Button>
      </div>
    </div>
  )
}

ScoreboardSettings.defaultProps = defaultProps
