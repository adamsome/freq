import type { ReactNode } from 'react'
import {
  BlowActionState,
  BlowCardSelection,
  BlowGameView,
  BlowPlayerSeatSize,
  BlowPlayerView,
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import { BlowCardProps } from './blow-card'
import BlowPlayerSeatHand from './blow-player-seat-hand'
import BlowPlayerSeatOutline from './blow-player-seat-outline'
import BlowCoin from './tokens/blow-coin'

type Props = {
  className?: string
  game?: BlowGameView
  player?: BlowPlayerView | null
  name?: string
  active?: boolean
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  theme: BlowThemeID
  size?: BlowPlayerSeatSize
  titleSuffix?: string
  drawnCards?: (BlowRoleID | null)[]
  card?: BlowCardProps
  cardSelection?: number | BlowCardSelection[]
  description?: ReactNode
  targetable?: boolean
  emptyContent?: ReactNode
  showTitle?: boolean
  onClick?: (player: BlowPlayerView) => void
}

export type BlowPlayerSeatProps = Props

export default function BlowPlayerSeat(props: Props) {
  return (
    <BlowPlayerSeatOutline {...props}>
      <BlowPlayerSeatContent {...props} />
    </BlowPlayerSeatOutline>
  )
}

function BlowPlayerSeatContent(props: Props) {
  const { player, size, description, emptyContent, showTitle = true } = props

  if (player === null) {
    if (emptyContent) return <>{emptyContent}</>
    else return <div className="text-center text-gray-500">Empty</div>
  }

  if (player === undefined) return <SkeletonBox className="h-full w-full" />

  return (
    <div className={cx('flex select-none flex-col space-y-0.5')}>
      {showTitle && <BlowPlayerSeatTitle {...props} />}

      <div className="flex flex-1">
        {size !== 'lg' && (
          <div className="flex-center flex-1">
            <BlowPlayerSeatCoins {...props} />
          </div>
        )}

        <BlowPlayerSeatHand
          {...props}
          className={cx(size !== 'lg' && 'ml-1')}
        />
      </div>

      {description && <div className="max-w-xs">{description}</div>}
    </div>
  )
}

function BlowPlayerSeatTitle(props: Props) {
  const { player, size, name, titleSuffix, active } = props
  if (!player) return null
  return (
    <div
      className={cx({
        'mb-1 xs:mb-3': size === 'lg',
        'text-lg': size === 'lg',
        'text-cyan-600 dark:text-cyan-400': player.active || active,
        'text-red-600 dark:text-red-500': player.counter,
        'text-overflow': true,
      })}
    >
      {name ?? player.name}
      {titleSuffix && (
        <span className="ml-1 text-gray-400 dark:text-gray-600">
          {titleSuffix}
        </span>
      )}
    </div>
  )
}

function BlowPlayerSeatCoins(props: Props) {
  const { player } = props
  if (player?.coins == null) return null

  return (
    <BlowCoin size="lg" showIndividualCoins={false} animate>
      {player.coins}
    </BlowCoin>
  )
}
