import React, { useEffect, useState } from 'react'
import usePrevious from '../../hooks/use-previous'
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

interface WordDef {
  text: string
  styleColor?: string
  className?: string
}

type Word = string | WordDef

interface Line {
  prefix?: Word[]
  words: Word[]
}

const TAUPE = 'text-taupe dark:text-taupe-dark'

function createPrefix(team?: 1 | 2) {
  const prefixText = `cwd:~ team_${getTeamName(team).toLowerCase()}$ `
  return [{ text: prefixText, styleColor: getTeamColor(team) }]
}

function toWord(
  text: string,
  {
    styleColor,
    className = TAUPE,
  }: { styleColor?: string; className?: string } = {}
) {
  return { text, styleColor, className }
}

function createLines(guess?: CwdLastAct): Line[] {
  const prefix = createPrefix(guess?.team)

  if (!guess) return [{ prefix, words: [''] }]

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
    const words = [toWord('Turn passed from '), from, toWord(' to '), to]
    return [{ prefix, words: ['pass'] }, { words }]
  }

  const wordWord = { text: `'${formattedWord}'`, className: 'font-bold' }
  const line1 = { prefix, words: ['guess ', wordWord] }

  if (scratch) {
    const text = '[[CRITICAL ERROR]] Terminating...'
    const word = { text, className: 'text-yellow dark:text-yellow-dark' }
    return [line1, { words: [word] }]
  }

  const status = correct
    ? { text: '[SUCCESS] ', styleColor: 'CodeSuccess' }
    : toWord('[FAIL] ')

  let msgWords: Word[] = ['']
  if (win) {
    msgWords = correct
      ? [{ text: 'All codes cracked!', styleColor: 'CodeSuccess' }]
      : [{ text: `That's ${otherName}'s last code!`, styleColor: otherColor }]
  } else if (correct) {
    msgWords = [toWord('May guess again.')]
  } else if (state === 0) {
    msgWords = [toWord('Incorrect code.')]
  } else {
    const other = { text: `${otherName}'s`, styleColor: otherColor }
    msgWords = [toWord("That's "), other, toWord(' code!')]
  }

  return [line1, { words: [status, ...msgWords] }]
}

const asWordDef = (word: Word): WordDef =>
  typeof word === 'string' ? { text: word } : word

const getLineCharCount = (line?: Line): number =>
  line?.words.reduce((acc, w) => acc + asWordDef(w).text.length, 0) ?? -1

export default function CodeGuessStatus({ guess, turn }: Props) {
  const [lineIndex, setLineIndex] = useState(0)
  const [lines, setLines] = useState<Line[]>(() => [
    { prefix: createPrefix(turn), words: [''] },
  ])
  const [lineIndices, setLineIndices] = useState([0])
  const [blink, setBlink] = useState(true)
  const prevGuess = usePrevious(guess)

  useEffect(() => {
    if (prevGuess?.at === guess?.at) return

    const lines = createLines(guess)
    setLineIndex(0)
    setLines(lines)
    setLineIndices(lines.map(() => 0))
  }, [prevGuess, guess])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlink((prev) => !prev)
    }, 500)

    return () => clearTimeout(timeout)
  }, [blink])

  useEffect(() => {
    const index = lineIndices[lineIndex]
    const line = lines[lineIndex]

    // If end of line is reached, move to next line if there is one
    if (index >= getLineCharCount(line)) {
      if (lineIndex < lines.length - 1) {
        setLineIndex((prev) => prev + 1)
      }
    }

    // Delay keystrokes b/w 75-100 ms; unless its the 1st char of
    // the 2nd or greater line, then delay longer
    const delay =
      index === 0 && lineIndex !== 0 ? 1200 : Math.random() * 60 + 20

    const timeout = setTimeout(() => {
      setLineIndices((prev) => {
        const next = [...prev]
        next[lineIndex]++
        return next
      })
    }, delay)

    return () => clearTimeout(timeout)
  }, [lineIndex, lines, lineIndices])

  const writeMessage = (line: Line, index: number) => {
    const words: WordDef[] = []
    const lineCharIndex = lineIndices[index]

    for (let w = 0; w < (line.prefix?.length ?? 0); w++) {
      const word = asWordDef(line.prefix?.[w] ?? '')
      if (word) words.push(word)
    }

    for (let w = 0, c = 0; w < line.words.length; w++) {
      if (c >= lineCharIndex) break

      const word = asWordDef(line.words[w])
      const text = word.text.substr(0, lineCharIndex - c)
      words.push({ ...word, text })
      c += text.length
    }

    return (
      <span className="font-mono">
        {words.map((w, i) => (
          <span
            key={i}
            className={w.className ?? ''}
            style={styleColor(w.styleColor)}
          >
            {w.text}
          </span>
        ))}

        {index === lineIndex && <span>{blink ? '|' : ' '}</span>}
      </span>
    )
  }

  const toLine = (line: Line, index: number) => {
    return (
      <div key={index} className="flex justify-start items-center px-2 sm:px-4">
        {writeMessage(line, index)}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-16 py-2">
      {lines.slice(0, lineIndex + 1).map(toLine)}
    </div>
  )
}

CodeGuessStatus.defaultProps = defaultProps
