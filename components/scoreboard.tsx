import React, { useState } from 'react'
import colorDict from '../lib/color-dict'
import { Game } from '../types/game.types'
import { Player } from '../types/player.types'
import { partition } from '../util/array'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  game: Game
}

const defaultProps = {}

const Scoreboard = ({ game }: Props) => {
  const [selected, setSelected] = useState<string | null>(null)

  const { score_team_1, score_team_2 } = game
  const [, players] = partition((p) => p.team == null, game.players)
  const teams = partition((p) => p.team === 1, players)

  const colorPlayer = (p: Player) => {
    const color = colorDict[p.color ?? 0]?.hex
    return {
      color: selected === p.id ? 'var(--body-light)' : color,
      background: selected === p.id ? color : undefined,
    }
  }

  return (
    <div className="wrapper">
      <div className="header">
        <div className="icon">🔥</div>
        <div className="name">Red</div>
        <div className="score">
          {score_team_1} &mdash; {score_team_2}
        </div>
        <div className="name right">Blue</div>
        <div className="icon right">🌊</div>
      </div>

      <div className="grid">
        {teams.map((t, i) => (
          <div key={i} className={cx('column', i === 1 && 'right')}>
            {t.map((p) => (
              <div
                key={p.id}
                className={cx('player', selected === p.id && 'selected')}
                style={colorPlayer(p)}
                onClick={() => setSelected(p.id)}
              >
                <div className="icon">{p.icon}</div>
                <div className="name-wrapper">
                  <div className="name">{`${p.name ?? 'Unnamed'}`}</div>
                  {game.psychic === p.id && <div>🧠</div>}
                </div>
                <div className="score">{p.score ?? 0}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .wrapper {
          width: 100%;
        }

        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-weight: 800;
          border-bottom: 1px solid var(--border-3);
          padding: 0 0.87em;
        }

        .header > div {
          flex: 0 0 auto;
        }

        .header > .name {
          width: 5em;
        }

        .header > .name.right {
          text-align: right;
        }

        .header > .score {
          flex: 1;
          text-align: center;
          font-size: var(--font-size-lg);
        }

        .score {
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: 50% 50%;
          width: 100%;
        }

        .column {
          padding-top: 3px;
        }

        .column:not(:last-of-type) {
          border-right: 1px solid var(--border-3);
        }

        .player {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          color: var(--body);
          padding: var(--stack-xs) 0.87em;
          white-space: nowrap;
          margin-right: 3px;
          cursor: pointer;
        }

        .column.right .player {
          margin-right: 0;
          margin-left: 3px;
          flex-direction: row-reverse;
        }

        .player:hover {
          background: var(--bg-1);
        }

        .player > * {
          text-align: center;
        }

        .player .icon,
        .header .icon {
          flex: 0 0 1.5em;
          margin-right: var(--inset-xs);
          text-align: center;
        }

        .icon.right {
          margin-right: unset;
          margin-left: var(--inset-xs);
        }

        .player .name-wrapper {
          flex: 1;
          display: flex;
        }

        .player .name {
          text-align: left;
          margin-right: var(--inset-sm);
        }

        .column.right .name-wrapper {
          flex-direction: row-reverse;
        }

        .column.right .name {
          text-align: right;
          margin-right: 0;
          margin-left: var(--inset-sm);
        }

        .player .score {
        }
      `}</style>
    </div>
  )
}

Scoreboard.defaultProps = defaultProps

export default Scoreboard
