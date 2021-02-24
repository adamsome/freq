import React from 'react'
import { GameView } from '../types/game.types'
import { styleLinearGradientText } from '../util/dom-style'

type Props = typeof defaultProps & {
  game?: GameView
}

const defaultProps = {}

export default function HeaderTitle({ game }: Props) {
  return (
    <h1>
      <div style={styleLinearGradientText('Freq')}>{game ? `Freq` : ''}</div>
      {game?.room && (
        <>
          <div className="slash">/</div>
          <div className="room">
            <span>{game.room.toLowerCase()}</span>
          </div>
        </>
      )}

      <style jsx>{`
        h1 {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: var(--font-size-lg);
          font-weight: 800;
          margin: 0;
          overflow: hidden;
          white-space: nowrap;
        }

        h1 > * {
          flex: 0 0 auto;
        }

        .slash {
          color: var(--hint);
          font-weight: 300;
          margin: 0 7px 0 8px;
        }

        h1 > .room {
          flex: 1;
          font-weight: 300;
          color: var(--subtle);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </h1>
  )
}

HeaderTitle.defaultProps = defaultProps
