import { ResPlayerProps } from '../../lib/types/res.types'
import { cx } from '../../lib/util/dom'
import { useResGame } from '../../lib/util/use-game'
import ResCardBody from './res-card-body'
import ResCardTitle from './res-card-title'

type Props = ResPlayerProps & {
  size: readonly [number, number]
  revealSpies?: boolean
  onSelect: () => void
}

export default function ResCard(props: Props) {
  const { game } = useResGame()
  if (!game) return null

  const {
    revealSpies,
    size,
    section,
    selected,
    selectable,
    benched,
    winner,
    onSelect,
  } = props
  const [w, h] = size
  const [width, height] = [`${w}px`, `${h}px`]
  const scale =
    section === 'select' || section === 'vote' || section === 'mission'

  return (
    <div
      className={cx(
        'flex transform flex-col',
        selectable && 'cursor-pointer',
        scale && 'transition-all',
        scale && (selected ? 'scale-100' : 'scale-90'),
        selectable && 'hover:scale-95'
      )}
      style={{ maxWidth: size[0] }}
    >
      <ResCardTitle {...props} />

      <div
        className={cx(
          'border-gray-300/10 transition-all',
          benched || winner === false
            ? 'shadow-md shadow-black/40'
            : 'shadow-lg shadow-black/50'
        )}
        style={{ width, height }}
        onClick={() => selectable && onSelect()}
      >
        <ResCardBody {...props} revealSpies={revealSpies} />
      </div>
    </div>
  )
  return null
}
