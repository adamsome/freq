import React from 'react'
import useGame from '../hooks/use-game'
import { postCommand } from '../util/fetch-json'
import ClueOption from './clue-option'
import ClueMeter from './clue-meter'
import ClueCard from './clue-card'
import ClueDirections from './clue-directions'
import ClueTarget from './clue-target'
import { Clue } from '../types/game.types'

type Props = typeof defaultProps

const defaultProps = {}

export default function CluesContainer(_: Props) {
  const { game, mutate } = useGame()
  if (!game) return null

  const isPsychic = game.currentPlayer?.id === game.psychic
  const isGuessing = game.phase === 'guess'
  const isChoosing = game.phase === 'choose'
  const hasSlider = game.playerGuesses.length > 0 || isGuessing

  const handleGuessChange = async (guess: number) => {
    if (!isGuessing) return
    try {
      await postCommand(game.room, 'set_guess', guess)
      mutate()
    } catch (err) {
      console.error(`Error posting guess 'set_guess'.`, err.data ?? err)
    }
  }

  const handleClueSelect = async (i: number) => {
    if (!isChoosing || !isPsychic) return
    try {
      mutate({ ...game, clue_selected: i }, false)
      await postCommand(game.room, 'select_clue', i)
      mutate()
    } catch (err) {
      console.error(`Error posting guess 'select_clue'.`, err.data ?? err)
    }
  }

  const card = (clue: Clue, i: number) => {
    const label = isChoosing ? i + 1 : undefined
    return (
      <ClueCard key={i} clue={clue} label={label} hasSlider={hasSlider}>
        {game.target != null && (
          <ClueTarget position={game.target * 100} width={game.target_width} />
        )}
      </ClueCard>
    )
  }

  const clues = game.cluesToShow.map((clue, i) => (
    <ClueOption
      key={clue.left + clue.right}
      hasSlider={hasSlider}
      selectable={isChoosing}
      selecting={isPsychic && isChoosing}
      selected={game.clue_selected === i}
      notSelected={game.clue_selected != null && game.clue_selected !== i}
      onSelect={() => handleClueSelect(i)}
    >
      <ClueMeter onGuessChange={handleGuessChange}>
        {card(clue, i)}

        <ClueDirections hasSlider={hasSlider} />
      </ClueMeter>
    </ClueOption>
  ))

  return <>{clues}</>
}

CluesContainer.defaultProps = defaultProps
