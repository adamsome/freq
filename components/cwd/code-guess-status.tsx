import React, { useEffect } from 'react'
import usePrevious from '../../hooks/use-previous'
import useTerminalAnimation, {
  TerminalLine,
  TypedTerminalLine,
} from '../../hooks/use-terminal-animation'
import { getTeamColor } from '../../lib/color-dict'
import { getTeamName } from '../../lib/game'
import { CwdLastAct } from '../../types/cwd.types'
import { styleColor } from '../../util/dom-style'
import { toTitleCase } from '../../util/string'

type Props = typeof defaultProps & {
  guess?: CwdLastAct
  turn?: 1 | 2
}

const defaultProps = {}

export interface Word {
  text: string
  styleColor?: string
  className?: string
}

const TAUPE = 'text-taupe dark:text-taupe-dark'

function createPrefix(team?: 1 | 2) {
  const prefixText = `cwd:~ team_${getTeamName(team).toLowerCase()}$ `
  return [{ text: prefixText, styleColor: getTeamColor(team) }]
}

const body = (text: string): Word => ({ text })
const taupe = (text: string, className = TAUPE): Word => ({ text, className })

function createLines(guess?: CwdLastAct): TerminalLine<Word>[] {
  const prefix = createPrefix(guess?.team)

  if (!guess) return [{ prefix, words: [taupe('')] }]

  const { team, word, correct, state, win, pass } = guess

  const otherTeam = team === 1 ? 2 : 1
  const name = getTeamName(team)
  const otherName = getTeamName(otherTeam)
  const color = getTeamColor(team)
  const otherColor = getTeamColor(otherTeam)
  const formattedWord = toTitleCase(word ?? '')
  const scratch = state === -1

  if (pass) {
    const from = { text: name, styleColor: color }
    const to = { text: otherName, styleColor: otherColor }
    const words = [taupe('Turn passed from '), from, taupe(' to '), to]
    return [{ prefix, words: [body('pass')] }, { words }]
  }

  const wordWord = { text: `'${formattedWord}'`, className: 'font-bold' }
  const line1 = { prefix, words: [body('guess '), wordWord] }

  if (scratch) {
    const text = '[[CRITICAL ERROR]] Terminating...'
    const word = { text, className: 'text-yellow dark:text-yellow-dark' }
    return [line1, { words: [word] }]
  }

  const status = correct
    ? { text: '[SUCCESS] ', styleColor: 'CodeSuccess' }
    : taupe('[FAIL] ')

  let msgWords: Word[] = []
  if (win) {
    msgWords = correct
      ? [{ text: 'All codes cracked!', styleColor: 'CodeSuccess' }]
      : [{ text: `That's ${otherName}'s last code!`, styleColor: otherColor }]
  } else if (correct) {
    msgWords = [taupe('May guess again.')]
  } else if (state === 0) {
    msgWords = [taupe('Incorrect code.')]
  } else {
    const other = { text: `${otherName}'s`, styleColor: otherColor }
    msgWords = [taupe("That's "), other, taupe(' code!')]
  }

  return [line1, { words: [status, ...msgWords] }]
}

export default function CodeGuessStatus({ guess, turn }: Props) {
  // Turn our guess status lines into a terminal 'typing'/'typewriter' effect
  const [terminalLines, cursorBlink, setLines] = useTerminalAnimation<Word>(
    () => [{ prefix: createPrefix(turn), words: [taupe('')] }],
    // Delay the reveal of scratch guesses even longer
    {
      lineDelay: () =>
        guess?.state === -1 ? 4000 : guess?.correct ? 200 : 1200,
    }
  )

  // Only set the status lines (thus triggering the terminal typing
  // animation) when the guess timestamp changes
  const prevGuess = usePrevious(guess)
  useEffect(() => {
    if (prevGuess?.at === guess?.at) return

    const lines = createLines(guess)
    setLines(lines)
  }, [prevGuess, guess])

  const toWord = (key: React.Key, word: Word) => (
    <span
      key={key}
      className={word.className ?? ''}
      style={styleColor(word.styleColor)}
    >
      {word.text}
    </span>
  )

  const toLine = (line: TypedTerminalLine<Word>, i: number) => (
    <div key={i} className="flex justify-start items-center px-2 sm:px-4">
      <span className="font-mono">
        {line.words.map((word, j) => toWord(i + j, word))}

        {i === terminalLines.length - 1 && (
          <span>{cursorBlink ? '|' : ' '}</span>
        )}
      </span>
    </div>
  )

  return (
    <div className="flex flex-col w-full h-16 py-2">
      {terminalLines.map(toLine)}
    </div>
  )
}

CodeGuessStatus.defaultProps = defaultProps
