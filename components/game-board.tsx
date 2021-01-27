import useGame from '../hooks/use-game'
import { cx } from '../util/dom'
import { postCommand } from '../util/fetch-json'
import CommandPanel from './command-panel'
import Meter from './meter'
import Scoreboard from './scoreboard'

const GameBoard = () => {
  const [game] = useGame()
  if (!game) return null

  const {
    phase,
    cluesToShow,
    clue_selected,
    target,
    playerGuesses,
    currentPlayer,
    psychic,
    averageGuess,
  } = game
  const isChoosing = game.phase === 'choose'
  const isGuessing = game.phase === 'guess'
  const showSlider = playerGuesses.length > 0 || phase === 'guess'
  const isPsychic = currentPlayer.id === psychic

  const handleGuessChange = async (guess: number) => {
    if (phase !== 'guess') return
    await postCommand('set_guess', guess)
  }

  const handleClueSelect = (i: number) => async () => {
    if (!isChoosing || !isPsychic) return
    await postCommand('select_clue', i)
  }

  return (
    <>
      {cluesToShow.map((clue, i) => (
        <div
          className={cx({
            'meter-wrapper': true,
            'show-slider': showSlider,
            choosing: isChoosing,
            'is-psychic': isPsychic,
            selected: clue_selected === i,
            'not-selected': clue_selected != null && clue_selected !== i,
          })}
          key={clue.left + clue.right}
          onClick={handleClueSelect(i)}
        >
          <Meter
            clue={clue}
            clueIndex={i}
            averageGuess={averageGuess}
            target={target}
            isChoosing={isChoosing}
            isGuessing={isGuessing}
            currentPlayer={currentPlayer}
            players={playerGuesses}
            onGuessChange={handleGuessChange}
          ></Meter>
        </div>
      ))}

      <div className="section">
        <CommandPanel />
      </div>

      <Scoreboard game={game} />

      <style jsx>{`
        .meter-wrapper {
          width: 100%;
          height: calc(9.5em - var(--stack-xl));
          margin-bottom: var(--stack-lg);
        }

        .meter-wrapper.show-slider {
          height: 9.5em;
        }

        .meter-wrapper.choosing {
          transform: scale(0.95);
          transition: 180ms opacity ease-in-out, 180ms transform ease-in-out;
        }

        .meter-wrapper.choosing.is-psychic {
          cursor: pointer;
        }

        .meter-wrapper.choosing.not-selected {
          opacity: 0.6;
        }

        .meter-wrapper.choosing.selected,
        .meter-wrapper.choosing.is-psychic:hover {
          transform: scale(1);
        }

        .section {
          width: 100%;
          margin-bottom: var(--stack-lg);
        }

        pre {
          font-family: var(--font-family-mono);
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default GameBoard
