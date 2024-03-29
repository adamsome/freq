import type { Key } from 'react'
import { useEffect } from 'react'
import { getTeamColor } from '../../lib/color-dict'
import { getTeamName } from '../../lib/game'
import { CwdLastAct } from '../../lib/types/cwd.types'
import { styleColor } from '../../lib/util/dom-style'
import { toTitleCase } from '../../lib/util/string'
import usePrevious from '../../lib/util/use-previous'
import useTerminalAnimation, {
  TerminalLine,
  TypedTerminalLine,
} from '../../lib/util/use-terminal-animation'

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

function createPrefix(team?: 1 | 2) {
  const prefixText = `cwd:~ team_${getTeamName(team).toLowerCase()}$ `
  const className = 'font-bold'
  return [{ text: prefixText, styleColor: getTeamColor(team), className }]
}

const body = (text: string): Word => ({ text })
const taupe = (text: string, className = ''): Word => ({
  text,
  className: `text-taupe dark:text-taupe-dark${
    className ? ` ${className}` : ''
  }`,
})

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
    const word = {
      text,
      className: 'font-bold text-amber-600 dark:text-amber-400',
    }
    return [line1, { words: [word] }]
  }

  const status = correct
    ? { text: '[SUCCESS] ', styleColor: 'CodeSuccess', className: 'font-bold' }
    : taupe('[FAIL] ', 'font-bold')

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
        guess?.state === -1 ? 3500 : guess?.correct ? 200 : 1500,
    }
  )

  // Only set the status lines (thus triggering the terminal typing
  // animation) when the guess timestamp changes
  const prevGuess = usePrevious(guess)
  useEffect(() => {
    if (prevGuess?.at === guess?.at) return

    const lines = createLines(guess)
    setLines(lines)
  }, [prevGuess, guess, setLines])

  const toWord = (key: Key, word: Word) => (
    <span
      key={key}
      className={word.className ?? ''}
      style={styleColor(word.styleColor)}
    >
      {word.text}
    </span>
  )

  const toLine = (line: TypedTerminalLine<Word>, i: number) => (
    <div key={i} className="flex items-center justify-start px-2 sm:px-4">
      <span className="font-mono">
        {line.words.map((word, j) => toWord(i + j, word))}

        {i === terminalLines.length - 1 && (
          <span>{cursorBlink ? '|' : ' '}</span>
        )}
      </span>
    </div>
  )

  return (
    <div className="flex h-16 w-full flex-col py-2">
      {terminalLines.map(toLine)}
    </div>
  )
}

CodeGuessStatus.defaultProps = defaultProps
