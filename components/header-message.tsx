import useGame from '../hooks/use-game'
import { styleColor } from '../util/dom-style'

const HeaderMessage = () => {
  const [game] = useGame()
  if (!game) return null

  return (
    <div className="wrapper">
      {game.headers.map((h, i) => (
        <div key={h.text + i} style={styleColor(h.color, h.colorLit)}>
          <div>{h.text}</div>
        </div>
      ))}

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          flex-wrap: wrap;
          width: 100%;
          font-size: var(--font-size-lg);
          font-weight: 600;
          min-height: 76px;
          padding: 0 15px;
        }

        .wrapper > * {
          flex: 1 1 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: var(--bg-1);
          text-align: center;
          line-height: 28px;
          border-radius: 0;
        }

        .wrapper > *:first-child {
          border-top-left-radius: var(--border-radius-md);
          border-top-right-radius: var(--border-radius-md);
        }

        .wrapper > *:last-child {
          border-bottom-left-radius: var(--border-radius-md);
          border-bottom-right-radius: var(--border-radius-md);
        }

        @media screen and (max-width: 768px) {
          .wrapper {
            padding: 0;
          }

          .wrapper > * {
            border-radius: 0;
          }

          .wrapper > *:first-child {
            border-radius: 0;
          }

          .wrapper > *:last-child {
            border-bottom: 1px solid var(--border);
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default HeaderMessage
