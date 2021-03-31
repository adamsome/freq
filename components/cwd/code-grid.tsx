import React from 'react'
import { CwdCodeView, CwdGameView } from '../../types/cwd.types'
import { range } from '../../util/array'
import CodeButton from './code-button'
import CodeGridStatus from './code-grid-status'
import CodeGuessStatus from './code-guess-status'

type Props = typeof defaultProps & {
  game?: CwdGameView
  onCodeClick: (index: number) => void
}

const defaultProps = {}

export default function CodeGrid({ game, onCodeClick }: Props) {
  if (game?.phase === 'prep') return null

  const psyhic1 = game?.players.find((p) => p.id === game.psychic_1)
  const psyhic2 = game?.players.find((p) => p.id === game.psychic_2)
  const codes: (CwdCodeView | undefined)[] =
    game?.codes ?? range(0, 25).map(() => undefined)

  return (
    <div className="grid grid-cols-5 w-full gap-1 mb-8 px-0 sm:px-4 font-mono">
      <div className="col-span-5">
        <CodeGuessStatus guess={game?.last_act} turn={game?.team_turn} />
      </div>

      <div className="col-span-5">
        <CodeGridStatus
          winner={game?.winner}
          turn={game?.team_turn}
          guess={game?.last_act}
        />
      </div>

      {codes.map((code, i) => (
        <CodeButton
          key={code?.word ?? i}
          code={code}
          guess={game?.last_act}
          currentPlayer={game?.currentPlayer}
          psychic1={psyhic1}
          psychic2={psyhic2}
          onClick={() => onCodeClick(i)}
        />
      ))}
    </div>
  )
}

CodeGrid.defaultProps = defaultProps
