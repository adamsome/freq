import { Game } from '../types/game.types'

type Props = typeof defaultProps & {
  game: Game
}

const defaultProps = {}

const Meter = ({ game }: Props) => {
  return (
    <>
      <div className="meter-bg"></div>
      <p>Meter {`'${game.game_id} - ${game.game_started_at}`}</p>

      <style jsx>{`
        .meter-bg {
          width: 100%;
          height: 200px;
          background: red;
          border: 1px solid transparent;
          border-radius: var(--border-radius-md);
        }
      `}</style>
    </>
  )
}

Meter.defaultProps = defaultProps

export default Meter
