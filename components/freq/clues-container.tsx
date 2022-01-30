import { FreqClue } from '../../lib/types/freq.types'
import { postCommand } from '../../lib/util/fetch-json'
import { useFreqGame } from '../../lib/util/use-game'
import SkeletonBox from '../layout/skeleton-box'
import ClueCard from './clue-card'
import ClueDirections from './clue-directions'
import ClueNeedleContainer from './clue-needle-container'
import ClueOption from './clue-option'
import ClueTarget from './clue-target'

type Props = typeof defaultProps

const defaultProps = {}

export default function CluesContainer(_: Props) {
  const { game, mutate } = useFreqGame()

  if (!game)
    return <SkeletonBox className="mb-4 h-32 w-full sm:mb-5 sm:h-40 md:px-4" />

  const isPsychic = game.currentPlayer?.id === game.psychic
  const isGuessing = game.phase === 'guess'
  const isChoosing = game.phase === 'choose'
  const hasSlider = game.playerGuesses.length > 0 || isGuessing

  const handleGuessChange = async (guess: number) => {
    if (!isGuessing) return
    try {
      await postCommand(game.type, game.room, 'set_guess', guess)
      mutate()
    } catch (err) {
      console.error(`Error posting guess 'set_guess'.`, err.data ?? err)
    }
  }

  const handleClueSelect = async (i: number) => {
    if (!isChoosing || !isPsychic) return
    try {
      mutate({ ...game, clue_selected: i }, false)
      await postCommand(game.type, game.room, 'select_clue', i)
      mutate()
    } catch (err) {
      console.error(`Error posting guess 'select_clue'.`, err.data ?? err)
    }
  }

  const card = (clue: FreqClue, i: number) => {
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
      <ClueNeedleContainer onGuessChange={handleGuessChange}>
        {card(clue, i)}

        <ClueDirections
          directions={game.playerDirections}
          hasSlider={hasSlider}
        />
      </ClueNeedleContainer>
    </ClueOption>
  ))

  return <>{clues}</>
}

CluesContainer.defaultProps = defaultProps
