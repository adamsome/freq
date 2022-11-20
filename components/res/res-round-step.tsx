import { ResStep } from '../../lib/types/res.types'
import { range } from '../../lib/util/array'
import { cx } from '../../lib/util/dom'

type Props = {
  className?: string
  step: ResStep
  roundIndex?: number
  voteStatus?: boolean
  forceNegative?: boolean
}

function getStepName(step: ResStep) {
  switch (step) {
    case 'spy_reveal':
      return 'Enemy Agents'
    case 'mission':
      return 'Execute'
    case 'team_select':
    case 'team_vote':
    case 'team_vote_reveal':
    case 'mission_reveal':
      return ''
  }
}

function showFailures(step: ResStep) {
  switch (step) {
    case 'team_select':
    case 'team_vote':
    case 'team_vote_reveal':
      return true
    default:
      return false
  }
}

export default function ResRoundStep({
  className,
  step,
  roundIndex,
  voteStatus,
  forceNegative,
}: Props) {
  if (step === 'mission_reveal') return null

  const name = getStepName(step)
  return (
    <div
      className={cx(
        'flow-root text-xs font-semibold',
        'rounded border border-gray-400/10',
        'bg-purple-950/80 text-white/30',
        className
      )}
    >
      <div
        className={cx(
          'flex h-4 items-center divide-x divide-gray-300/10 xs:h-5'
        )}
      >
        {name && (
          <span className="px-1.5">
            <div>{name}</div>
          </span>
        )}

        {showFailures(step) &&
          roundIndex != null &&
          range(5).map((i) => {
            const current = roundIndex === i
            const positive =
              current && voteStatus === true && step !== 'team_vote'
            const negative =
              i < roundIndex ||
              (current && voteStatus === false) ||
              forceNegative
            const neutral =
              current && voteStatus === true && step === 'team_vote'
            return (
              <div
                key={i}
                className={cx(
                  'flex-center h-full overflow-hidden whitespace-nowrap',
                  'px-1 xs:px-[5px]',
                  'text-[10px] leading-[14px] xs:text-xs xs:leading-[14px]',
                  current && 'text-center text-white/60',
                  positive && 'bg-phosphorus-500 text-black/50',
                  negative && 'bg-rose-500 text-black/50',
                  neutral && 'bg-purple-500 text-black/50',
                  i === 0 && 'rounded-l',
                  i === 4 && 'rounded-r',
                  !current && i > 0 && i < 4 && 'px-[3px] xs:px-[4px]'
                )}
                style={{
                  borderColor:
                    positive || negative || neutral
                      ? 'rgb(0 0 0 / 50%)'
                      : undefined,
                }}
              >
                {current ? 'Vote ' : ''}
                {i + 1}
              </div>
            )
          })}
      </div>
    </div>
  )
}
