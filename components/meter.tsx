import { Game } from '../types/game.types'

type Props = typeof defaultProps & {
  game?: Game
}

const defaultProps = {}

const Meter = ({ game }: Props) => {
  console.log('Meter', game)
  return <p>Meter {`'${game?.game_id}'`}</p>
}

Meter.defaultProps = defaultProps

export default Meter
