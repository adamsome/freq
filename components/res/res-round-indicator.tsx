import { ResStep } from '../../lib/types/res.types'
import { cx } from '../../lib/util/dom'
import ResRoundStep from './res-round-step'

type Props = {
  index: number
  current?: boolean
  positive?: boolean
  negative?: boolean
  neutral?: boolean
  disabled?: boolean
  step: ResStep
  roundIndex?: number
  voteStatus?: boolean
}

export default function ResRoundIndicator({
  index,
  current,
  positive,
  negative,
  neutral,
  disabled,
  step,
  roundIndex,
  voteStatus,
}: Props) {
  return (
    <div
      className={cx(
        'flex h-full items-center font-semibold',
        positive && 'bg-phosphorus-500 text-black',
        negative && 'bg-rose-500 text-black',
        neutral && 'bg-purple-500 text-black',
        disabled && 'text-gray-400/40',
        current ? 'w-full text-opacity-75' : 'w-7 text-opacity-50',
        index === 0 && 'rounded-l',
        index === 4 && 'rounded-r',
        current && index === 0 ? 'justify-start pl-2' : 'justify-center'
      )}
      style={{
        borderColor:
          positive || negative || neutral ? 'rgb(0 0 0 / 50%)' : undefined,
      }}
    >
      {current && (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-1">
          Mission{' '}
        </div>
      )}
      <div>{index + 1}</div>
      {current && (
        <ResRoundStep
          className={cx(
            'ml-2',
            'shadow shadow-gray-900/80',
            positive && 'shadow-phosphorus-900/80',
            negative && 'shadow-rose-900/80'
          )}
          step={step}
          roundIndex={roundIndex}
          voteStatus={voteStatus}
          forceNegative={negative && current}
        />
      )}
    </div>
  )
}
