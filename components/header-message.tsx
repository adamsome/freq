import useGame from '../hooks/use-game'
import { styleColor } from '../util/dom-style'

const HeaderMessage = () => {
  const [game] = useGame()
  if (!game) return null

  return (
    <div className="wrapper">
      {game.headers.map((h, i) => (
        <div key={h.text + i} style={styleColor(h.color)}>
          {h.text}
        </div>
      ))}

      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          align-content: center;
          flex-wrap: wrap;
          width: 100%;
          font-size: var(--font-size-lg);
          font-weight: 600;
          min-height: 76px;
        }

        .wrapper > * {
          flex: 0 1 auto;
          text-align: center;
          line-height: 28px;
          margin-bottom: var(--stack-sm);
        }

        .wrapper > *:not(:last-child) {
          margin-right: var(--inset-sm);
        }
      `}</style>
    </div>
  )
}

export default HeaderMessage
