import { FreqClue } from '../../types/freq.types'
import { LanguageCode } from '../../types/game.types'
import { randomGradient } from '../gradient-dict'
import FREQ_CLUES from './freq-clues'

function createClue(clues: string[]): FreqClue {
  const gradient = randomGradient()
  return { left: clues[0], right: clues[1], gradient }
}

interface RandomClueOptions {
  language?: LanguageCode
  excludeIndices?: number[]
}

function buildAvailableIndices(
  length: number,
  excludeIndices: number[] = []
): number[] {
  const indices = []
  for (let i = 0; i < length; i++) {
    if (!excludeIndices.includes(i)) indices.push(i)
  }
  return indices
}

export default function randomFreqCluePair(options: RandomClueOptions = {}) {
  const { language = 'en', excludeIndices = [] } = options
  const availableClues = FREQ_CLUES[language]
  const cluePairCount = availableClues.length / 2
  const indices = buildAvailableIndices(cluePairCount, excludeIndices)
  const index = indices[Math.floor(Math.random() * indices.length)]
  const clue1 = createClue(availableClues[index * 2])
  const clue2 = createClue(availableClues[index * 2 + 1])
  return { pair: [clue1, clue2], index }
}
