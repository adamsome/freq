import { ResMissionStatus, ResStep } from '../../lib/types/res.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

type Props = {
  index: number
  current?: boolean
  status: ResMissionStatus
  rejectedVoteRounds: number
  step: ResStep
}

export default function ResRoundIndicator({
  index,
  current,
  status,
  rejectedVoteRounds,
  step,
}: Props) {
  function getStepName(step: ResStep) {
    switch (step) {
      case 'spy_reveal':
        'Spies'
      case 'team_select':
        'Select'
      case 'team_vote':
      case 'team_vote_reveal':
        'Vote'
      case 'mission':
      case 'mission_reveal':
        'Execute'
    }
  }

  return (
    <div
      className={cx(
        'flex items-center font-semibold',
        status === 'success' && 'text-phosphorus-500',
        status === 'failure' && 'text-red-500',
        status === 'unplayed' && 'text-gray-400/40'
      )}
    >
      <div>
        {current ? 'Mission ' : ''}
        {index + 1}
      </div>
      {current && <div>{getStepName(step)}</div>}
      {rejectedVoteRounds > 0 && current && (
        <div className="ml-1">{range(rejectedVoteRounds).map(() => 'x')}</div>
      )}
    </div>
  )
}
