import {
  BlowRoleActionID,
  BlowActionState,
  BlowCardVariant,
  BlowPlayerView,
} from '../../lib/types/blow.types'
import SkeletonBox from '../layout/skeleton-box'
import BlowCard from './blow-card'
import BlowCoin from './blow-coin'
import BlowPlayerSeatOutline from './blow-player-seat-outline'

type Props = {
  player?: BlowPlayerView | null
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
}

export default function BlowPlayerSeat(props: Props) {
  return (
    <BlowPlayerSeatOutline {...props}>
      <BlowPlayerSeatContent {...props} />
    </BlowPlayerSeatOutline>
  )
}

function BlowPlayerSeatContent({ player, actions }: Props) {
  if (player === null)
    return <div className="text-overflow text-center text-gray-500">Empty</div>

  if (player === undefined) return <SkeletonBox className="w-full h-full" />

  const cards = player.cards

  const variant = (i: number): BlowCardVariant =>
    cards?.[i] === undefined
      ? 'empty'
      : cards?.[i] === null
      ? 'facedown'
      : 'faceup'

  return (
    <div className="flex flex-col space-y-0.5 select-none">
      <div className="text-overflow">{player.name}</div>

      <div className="flex-1 flex">
        <div className="flex-1 flex-center">
          {player.coins != null && (
            <BlowCoin size="md" showIndividualCoins={false}>
              {player.coins}
            </BlowCoin>
          )}
        </div>

        <div className="flex space-x-[3px] ml-1">
          {[0, 1].map((i) => (
            <BlowCard
              key={i}
              id={cards?.[i]}
              size="sm"
              variant={variant(i)}
              actions={actions}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
