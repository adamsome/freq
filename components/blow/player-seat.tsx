import { PlayerView } from '../../lib/types/game.types'

type Props = typeof defaultProps & {
  player: PlayerView
}

const defaultProps = {}

export default function PlayerSeat({ player }: Props) {
  return (
    <div className="w-24 h-16 bg-gray-700 text-gray-300">
      <div className="text-overflow">{player.name}</div>
    </div>
  )
}

PlayerSeat.defaultProps = defaultProps
