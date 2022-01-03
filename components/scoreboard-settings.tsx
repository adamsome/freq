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
    <div className="flex-center w-full my-3 sm:text-lg">
      <div className="flex-center p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <Button
          className="w-20 mr-0.5 text-sm sm:text-base"
          gray
          solid={isWins}
          onClick={() => onTypeToggle('wins')}
        >
          Wins
        </Button>
        <Button
          className="w-20 ml-0.5 text-sm sm:text-base"
          gray
          solid={!isWins}
          onClick={() => onTypeToggle('points')}
        >
          Points
        </Button>
      </div>
    </div>
  )
}

ScoreboardSettings.defaultProps = defaultProps
