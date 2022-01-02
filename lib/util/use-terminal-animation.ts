import { useCallback, useEffect, useState } from 'react'
import { resolveValueFn, ValueFn } from './value-fn'

export interface TerminalLine<T> {
  /** Prefix words will always be displayed on the line (no typing effect). */
  prefix?: T[]
  words: T[]
}

export interface TypedTerminalLine<T> {
  /** Only contains the list of words that have been typed so far. */
  words: T[]
  /** Whether the cursor should be shown on this line. */
  hasCursor: boolean
}

export interface UseTerminalAnimationOptions<T> {
  /**
   * Function to access a line word's text.
   * Default assumes `T` is either a string or has string `text` prop.
   */
  wordAccessor?: (t: T) => string
  /** Time in milliseconds to delay typing on a new line. */
  lineDelay?: ValueFn<number>
  /** Base amount of time in milliseconds to delay typing a character. */
  charDelay?: ValueFn<number>
  /** Max amount of random time in milliseconds to delay typing a character. */
  charRandomDelay?: ValueFn<number>
  /** Time in milliseconds to blink the cursor. */
  cursorBlinkDelay?: ValueFn<number>
}

const defaultAccessor = <T>(t: T) =>
  typeof t === 'string' ? t : ((t as any).text as string)

export default function useTerminalAnimation<T>(
  initialState: TerminalLine<T>[] | (() => TerminalLine<T>[]),
  options: UseTerminalAnimationOptions<T> = {}
) {
  const {
    wordAccessor = defaultAccessor,
    lineDelay = 1200,
    charDelay = 20,
    charRandomDelay = 60,
    cursorBlinkDelay = 500,
  } = options

  /** Index of the current line being typed. */
  const [lineIndex, setLineIndex] = useState(0)
  /** List of all lines that will be typed. */
  const [lines, rawSetLines] = useState<TerminalLine<T>[]>(initialState)
  /** Index per line indicating how many char have been typed. */
  const [lineIndices, setLineIndices] = useState([0])
  /** Flag indicating that the cursor has blinked on (vs. off) */
  const [cursorBlink, setCursorBlink] = useState(true)

  const txt = wordAccessor // Short alias

  /** Sets the list of lines to be typed. Triggers typing animation. */
  const setTerminalLines = useCallback((newLines: TerminalLine<T>[]) => {
    rawSetLines(newLines)
    setLineIndex(0)
    setLineIndices(newLines.map(() => 0))
  }, [])

  // Causes cursor to blink on and off
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCursorBlink((prev) => !prev)
    }, resolveValueFn(cursorBlinkDelay))

    return () => clearTimeout(timeout)
  }, [cursorBlink])

  // Performs the typing animation by iterating through the line and
  // character indices, each iteration w/ a small delay.
  // The indices are then used to substring the lines' characters, only
  // showing those that have been 'typed' so far.
  useEffect(() => {
    const index = lineIndices[lineIndex]
    const line = lines[lineIndex]

    // If end of line is reached, move to next line if there is one
    const charCount =
      line?.words.reduce((acc, w) => acc + txt(w).length, 0) ?? -1
    if (index >= charCount) {
      if (lineIndex < lines.length - 1) {
        setLineIndex((prev) => prev + 1)
      }
    }

    // Delay keystrokes b/w 20-80 ms; unless its the 1st char of
    // the 2nd or greater line, then delay longer
    const delay =
      index === 0 && lineIndex !== 0
        ? resolveValueFn(lineDelay)
        : resolveValueFn(charDelay) +
          Math.random() * resolveValueFn(charRandomDelay)

    const timeout = setTimeout(() => {
      // Increment the current line's character index
      setLineIndices((prev) => {
        const next = [...prev]
        next[lineIndex]++
        return next
      })
    }, delay)

    return () => clearTimeout(timeout)
  }, [lineIndex, lines, lineIndices])

  // Return only the list of words (and their characters) that have been typed.
  const buildWords = (
    line: TerminalLine<T>,
    index: number
  ): TypedTerminalLine<T> => {
    const words: T[] = []
    const lineCharIndex = lineIndices[index]

    for (let w = 0; w < (line.prefix?.length ?? 0); w++) {
      const word = line.prefix?.[w]
      // Always include prefix words
      if (word) words.push(word)
    }

    for (let w = 0, c = 0; w < line.words.length; w++) {
      // Stop pushing words once character index is met
      if (c >= lineCharIndex) break

      const word = line.words[w]
      // Chop the word if it will exceed the current character index
      const text = txt(word).substr(0, lineCharIndex - c)
      words.push({ ...word, text })
      c += text.length
    }

    // Cursor should be on the last line that's been iterated/typed through
    const hasCursor = index === lineIndex
    return { words, hasCursor }
  }

  /** List of lines and their words that have been typed. */
  const typedWordsPerLine = lines.slice(0, lineIndex + 1).map(buildWords)

  return [typedWordsPerLine, cursorBlink, setTerminalLines] as const
}
