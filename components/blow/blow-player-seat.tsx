import type { ReactNode } from 'react'
import {
  BlowActionState,
  BlowCardSelection,
  BlowCardSize,
  BlowCardSource,
  BlowCardVariant,
  BlowGameView,
  BlowPlayerSeatSize,
  BlowPlayerView,
  BlowRoleActionID,
  BlowRoleID,
  BlowThemeID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import SkeletonBox from '../layout/skeleton-box'
import BlowCard, { BlowCardProps } from './blow-card'
import BlowCardContainer from './blow-card-container'
import BlowCoin from './tokens/blow-coin'
import BlowPlayerSeatOutline from './blow-player-seat-outline'

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

  if (player === undefined) return <SkeletonBox className="h-full w-full" />

  return (
    <div className={cx('flex select-none flex-col space-y-0.5')}>
      <BlowPlayerSeatTitle {...props} />

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

function BlowPlayerSeatHand(props: Props) {
  const {
    className,
    game,
    player,
    size,
    drawnCards,
    card = {},
    cardSelection,
    actions,
    theme,
  } = props

  const cardSize: BlowCardSize = size === 'lg' ? 'lg' : 'sm'
  const handCx = cx(
    'flex',
    size !== 'lg' ? 'space-x-[3px]' : 'space-x-3',
    className
  )

  const getVariant = (
    i: number,
    cards?: (BlowRoleID | null)[]
  ): BlowCardVariant =>
    cards?.[i] === undefined
      ? 'empty'
      : cards?.[i] === null
      ? 'facedown'
      : 'faceup'

  const getCardDefaults = (
    i: number,
    source: BlowCardSource = 'hand'
  ): BlowCardProps => {
    const cards = source === 'drawn' ? drawnCards : player?.cards
    const cardsKilled =
      source === 'drawn' ? [false, false] : player?.cardsKilled

    const variant = getVariant(i, cards)
    const id = cards?.[i]
    const killed = (cardsKilled ?? [false, false])[i]
    const props = { id, index: i, size: cardSize, variant, actions, killed }

    const { onClick: rawOnClick, ...rest } = card
    const onClick = rawOnClick
      ? (id: BlowRoleID, i: number, rawSource?: BlowCardSource) =>
          rawOnClick?.(id, i, rawSource ?? source)
      : undefined

    const cardsProps = { ...props, ...rest, onClick }

    const isSelected =
      typeof cardSelection === 'number'
        ? cardSelection === i
        : cardSelection?.some((s) => s.index === i && s.type === source)
    if (isSelected) cardsProps.selected = true

    return cardsProps
  }

  return (
    <div
      className={cx({
        'flex-center w-full flex-col': drawnCards?.length,
      })}
    >
      {drawnCards && drawnCards.length > 0 && (
        <div className={handCx}>
          {drawnCards?.map((_, i) => (
            <BlowCard key={i} {...getCardDefaults(i, 'drawn')} theme={theme} />
          ))}
        </div>
      )}

      {drawnCards && drawnCards.length > 0 && (
        <div
          className={cx(
            'mt-0.5 mb-3',
            'text-xs font-normal text-gray-400 dark:text-gray-600'
          )}
        >
          DRAWN CARDS
        </div>
      )}

      <div className={handCx}>
        {[0, 1].map((i) => (
          <BlowCardContainer key={i} {...getCardDefaults(i)} game={game} />
        ))}
      </div>

      {drawnCards && drawnCards.length > 0 && (
        <div
          className={cx(
            'mt-0.5',
            'text-xs font-normal text-gray-400 dark:text-gray-600'
          )}
        >
          CURRENT HAND
        </div>
      )}
    </div>
  )
}
