import Image from 'next/image'
import { ResPlayerProps, ResVoteStatus } from '../../lib/types/res.types'
import { cx } from '../../lib/util/dom'
import ResCardBorder from './res-card-border'
import ResCardSticker from './res-card-sticker'
import ResOrb from './res-orb'

type Props = ResPlayerProps & {
  revealSpies?: boolean
}

function getVoteText(voteStatus?: ResVoteStatus) {
  switch (voteStatus) {
    case 'voted':
      return 'I VOTED'
    case 'approve':
      return 'AYE'
    case 'reject':
      return 'NAY'
  }
}

export default function ResCardBody({
  section,
  orderIndex,
  spy,
  revealSpies,
  active,
  cardSrc,
  missionNumber,
  missionFailure,
  benched,
  voteStatus,
  missionResultStatus,
  winner,
}: Props) {
  return (
    <div className="relative h-full w-full transition-all">
      <div
        className={cx(
          'absolute inset-0 z-0 overflow-hidden rounded',
          cardSrc == null && 'border border-gray-300/10 bg-slate-600',
          benched && 'grayscale-[75%]',
          (winner === false || (revealSpies && !spy)) &&
            'blur-[0px] brightness-50 contrast-[1.1] grayscale sepia-[50%]'
        )}
      >
        {cardSrc && (
          <Image src={cardSrc} alt={cardSrc} width={832} height={1216} />
        )}
      </div>

      <ResCardBorder>
        {active && <ResOrb className="absolute top-5 right-5" />}

        {voteStatus !== 'notVoted' &&
          (section === 'vote' || section === 'mission') && (
            <ResCardSticker
              className="absolute bottom-4 right-4"
              rotateIndex={orderIndex}
              green={voteStatus === 'approve'}
              red={voteStatus === 'reject'}
              disabled={section === 'mission'}
            >
              {getVoteText(voteStatus)}
            </ResCardSticker>
          )}

        {missionResultStatus != null && <div>acted</div>}
      </ResCardBorder>

      {missionNumber != null && (
        <ResCardBorder
          title={`MISSION ${missionNumber}`}
          lit={!missionFailure}
        />
      )}
    </div>
  )
}
