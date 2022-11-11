import { ResRoundStatus } from '../../lib/types/res.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

type Props = {
  index: number
  status: ResRoundStatus
  rejectedVoteRounds: number
}

export default function ResRoundIndicator({
  index,
  status,
  rejectedVoteRounds,
}: Props) {
  return (
    <div
      className={cx(
        'flex-center',
        status === 'success' && 'text-phosphorus-500',
        status === 'failure' && 'text-red-500',
        status === 'unplayed' && 'text-gray-600'
      )}
    >
      <div>{index + 1}</div>
      {rejectedVoteRounds > 0 && status === 'current' && (
        <div className="ml-1">{range(rejectedVoteRounds).map(() => 'x')}</div>
      )}
    </div>
  )
}
