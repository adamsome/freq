import {
  BlowCardSize,
  BlowCardSource,
  BlowCardVariant,
  BlowRoleID,
} from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowCard, { BlowCardProps } from './blow-card'
import BlowCardContainer from './blow-card-container'
import { BlowPlayerSeatProps } from './blow-player-seat'

export default function BlowPlayerSeatHand(props: BlowPlayerSeatProps) {
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
    size !== 'lg' ? 'space-x-[3px]' : 'space-x-2',
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

  const hasDrawn = (drawnCards?.length ?? 0) > 0

  return (
    <div
      className={cx({
        'flex-center w-full flex-col space-y-2': hasDrawn,
      })}
    >
      {hasDrawn && (
        <div className={handCx}>
          {drawnCards?.map((_, i) => (
            <BlowCard key={i} {...getCardDefaults(i, 'drawn')} theme={theme} />
          ))}
        </div>
      )}

      {hasDrawn && (
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

      {hasDrawn && (
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
