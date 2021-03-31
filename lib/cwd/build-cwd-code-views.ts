import { CwdCodeView, CwdGame } from '../../types/cwd.types'
import { PlayerView } from '../../types/game.types'
import { arrayEquals, rejectNil } from '../../util/array'
import { toIDMap, toTruthMap } from '../../util/object'
import { toTitleCase } from '../../util/string'
import { getTeamPlayers } from '../player'
import CWD_CODE_WORD_BREAKS from './cwd-code-word-breaks'

export function cwdCodeEquals(a?: CwdCodeView, b?: CwdCodeView): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.brokenLength === b.brokenLength &&
    a.brokenWord === b.brokenWord &&
    a.clickable === b.clickable &&
    a.selected === b.selected &&
    arrayEquals(a.icons, b.icons) &&
    a.level === b.level &&
    a.lit === b.lit &&
    a.revealed === b.revealed &&
    a.state === b.state &&
    a.word === b.word
  )
}

export default function buildCwdCodeViews(
  game: CwdGame,
  player?: PlayerView
): CwdCodeView[] {
  if (game.phase === 'prep') return []

  // Psychics should see all 25 revealed codes
  const id = player?.id
  const isPsychic = id === game.psychic_1 || id === game.psychic_2
  const revealedIndices = game.code_reveals
  const revealMap = toTruthMap(revealedIndices, (i) => i)
  const playerMap = toIDMap(game.players)

  const lastRevealed = game.code_reveals[game.code_reveals.length - 1]

  const team = getTeamPlayers(game.players, player?.team)
  const visitedCountByIndex = team.reduce((acc, p) => {
    const visitedIndices = game.visited?.[p.id] ?? []
    visitedIndices.forEach((i) => {
      if (acc[i] == null) acc[i] = 0
      acc[i]++
    })
    return acc
  }, {} as Record<number, number>)

  return game.code_words.map((rawWord, i) => {
    const word = toTitleCase(rawWord)

    const allGuesses = Object.entries(game.guesses ?? {})
    const guesses = allGuesses.filter(([_, guess]) => guess.value === i)
    const icons = rejectNil(guesses.map(([pid]) => playerMap[pid]?.icon))
    const selected = guesses.some(([pid]) => pid === id)

    const view: CwdCodeView = {
      word,
      icons,
      selected,
      lit: lastRevealed === i,
      ...buildBrokenWordInfo(word, CWD_CODE_WORD_BREAKS[word.toLowerCase()]),
    }

    const visitedCount = visitedCountByIndex[i] ?? 0
    if (visitedCount > 0) {
      view.level = Math.min(visitedCount, 3)
    }

    const state = game.code_states[i]
    if (revealMap[i]) {
      view.revealed = state
    }
    if (isPsychic || game.phase === 'win') {
      view.state = state
    }
    if (view.revealed == null && player?.team === game.team_turn) {
      view.clickable = true
    }

    return view
  })
}

function buildBrokenWordInfo(word: string, breakWord?: number) {
  const brokenWord = breakWord
    ? `${word.slice(0, breakWord)}-${word.slice(breakWord)}`
    : word
  const brokenParts = brokenWord.split(/[-\s]+/)
  const broken2Length = brokenParts[1]?.length ?? 0
  const broken1Length = brokenParts[0]?.length + (broken2Length > 0 ? 1 : 0)
  const brokenLength = Math.max(broken1Length, broken2Length)
  return { brokenWord, brokenLength }
}
