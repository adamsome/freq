import useGame from '../hooks/use-game'
import { cx } from '../util/dom'
import { postCommand } from '../util/fetch-json'
import CommandPanel from './command-panel'
import HeaderMessage from './header-message'
import Meter from './meter'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps & {
  roomUrl?: string
}

const defaultProps = {}

const GameBoard = ({ roomUrl }: Props) => {
  const [game] = useGame()
  if (!game) return null

  const {
    phase,
    cluesToShow,
    clue_selected,
    target,
    target_width,
    playerGuesses,
    playerDirections,
    currentPlayer,
    psychic,
    averageGuess,
  } = game
  if (!currentPlayer) return null

  const isChoosing = game.phase === 'choose'
  const isGuessing = game.phase === 'guess'
  const showSlider = playerGuesses.length > 0 || phase === 'guess'
  const isPsychic = currentPlayer.id === psychic

  const handleGuessChange = async (guess: number) => {
    if (phase !== 'guess') return
    try {
      await postCommand('set_guess', guess)
    } catch (err) {
      console.error(`Error posting guess 'set_guess'.`, err.data ?? err)
    }
  }

  const handleClueSelect = (i: number) => async () => {
    if (!isChoosing || !isPsychic) return
    try {
      await postCommand('select_clue', i)
    } catch (err) {
      console.error(`Error posting guess 'select_clue'.`, err.data ?? err)
    }
  }

  return (
    <>
      <div className="section top">
        <HeaderMessage />
      </div>

      {phase === 'prep' && roomUrl && (
        <div className="link section">
          <div>Other players can use this link to join:</div>
          <a className="url" href={roomUrl} target="_blank" rel="noreferrer">
            {roomUrl}
          </a>
        </div>
      )}

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
            target_width={target_width}
            isChoosing={isChoosing}
            isGuessing={isGuessing}
            currentPlayer={currentPlayer}
            players={playerGuesses}
            directions={playerDirections}
            onGuessChange={handleGuessChange}
          ></Meter>
        </div>
      ))}

      <div className="section">
        <CommandPanel />
      </div>

      <div className="section">
        <Scoreboard game={game} />
      </div>

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
          opacity: 0.3;
        }

        .meter-wrapper.choosing.selected,
        .meter-wrapper.choosing.is-psychic:hover {
          transform: scale(1);
        }

        .link {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: var(--subtle);
          font-size: var(--font-size-sm);
        }

        .link a {
          text-align: center;
          line-height: 1.15;
        }

        .section {
          width: 100%;
          margin-bottom: var(--stack-lg);
        }

        .section.top {
          margin-bottom: var(--stack-sm);
        }

        pre {
          font-family: var(--font-family-mono);
          margin: 0;
        }
      `}</style>
    </>
  )
}

GameBoard.defaultProps = defaultProps

export default GameBoard
