import type { ReactNode } from 'react'
import {
  BlowActionState,
  BlowCardSize,
  BlowCardVariant,
  BlowPlayerSeatSize,
  BlowPlayerView,
  BlowRoleActionID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import { BlowCardProps } from './blow-card'
import BlowCardContainer from './blow-card-container'
import BlowCoin from './blow-coin'
import BlowPlayerSeatOutline from './blow-player-seat-outline'

type Props = {
  className?: string
  player?: BlowPlayerView | null
  name?: string
  actions?: Partial<Record<BlowRoleActionID, BlowActionState>>
  size?: BlowPlayerSeatSize
  titleSuffix?: string
  card?: BlowCardProps
  cardSelected?: number
  description?: ReactNode
  targetable?: boolean
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
  const { player, size, description } = props

  if (player === null)
    return <div className="text-overflow text-center text-gray-500">Empty</div>

  if (player === undefined) return <SkeletonBox className="w-full h-full" />

  return (
    <div className={cx('flex flex-col space-y-0.5 select-none')}>
      <BlowPlayerSeatTitle {...props} />

      <div className="flex-1 flex">
        {size !== 'lg' && (
          <div className="flex-1 flex-center">
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
  const { player, size, name, titleSuffix } = props
  if (!player) return null
  return (
    <div
      className={cx({
        'mb-1 xs:mb-3': size === 'lg',
        'text-lg': size === 'lg',
        'text-cyan-600 dark:text-cyan-400': player.active,
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
    <BlowCoin size="md" showIndividualCoins={false}>
      {player.coins}
    </BlowCoin>
  )
}

function BlowPlayerSeatHand(props: Props) {
  const { className, player, size, card = {}, cardSelected, actions } = props
  const cards = player?.cards
  const cardSize: BlowCardSize = size === 'lg' ? 'md' : 'sm'

  const getVariant = (i: number): BlowCardVariant =>
    cards?.[i] === undefined
      ? 'empty'
      : cards?.[i] === null
      ? 'facedown'
      : 'faceup'

  const getCardDefaults = (i: number): BlowCardProps => {
    const variant = getVariant(i)
    const id = cards?.[i]
    const cardsKilled = player?.cardsKilled ?? [false, false]
    const killed = cardsKilled[i]
    const props = { id, index: i, size: cardSize, variant, actions, killed }
    const cardsProps = { ...props, ...card }
    if (cardSelected === i) cardsProps.selected = true
    return cardsProps
  }

  return (
    <div
      className={cx(
        'flex',
        size !== 'lg' ? 'space-x-[3px]' : 'space-x-3',
        className
      )}
    >
      {[0, 1].map((i) => (
        <BlowCardContainer key={i} {...getCardDefaults(i)} />
      ))}
    </div>
  )
}
