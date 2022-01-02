import { randomGradient } from '../gradient-dict'
import {
  FreqClue,
  FreqClueDifficulty,
  FreqClueDifficultyOrAll,
} from '../types/freq.types'
import { LanguageCode } from '../types/game.types'
import FREQ_CLUES from './freq-clues'

function createClue(clues: string[]): FreqClue {
  const gradient = randomGradient()
  return { left: clues[0], right: clues[1], gradient }
}

interface RandomClueOptions {
  language?: LanguageCode
  difficulty?: FreqClueDifficulty
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

function parseDifficulties(
  difficulty: FreqClueDifficultyOrAll | FreqClueDifficultyOrAll[] = 'all'
): FreqClueDifficulty[] {
  const difficulties = Array.isArray(difficulty) ? difficulty : [difficulty]
  return difficulties.includes('all')
    ? ['easy', 'hard']
    : (difficulties as FreqClueDifficulty[])
}

export default function randomFreqCluePair(options: RandomClueOptions = {}) {
  const { language = 'en', difficulty, excludeIndices = [] } = options

  const difficulties = parseDifficulties(difficulty)
  const clues = difficulties.flatMap(
    (difficulty) => FREQ_CLUES[language][difficulty]
  )

  const cluePairCount = clues.length / 2
  const indices = buildAvailableIndices(cluePairCount, excludeIndices)
  const index = indices[Math.floor(Math.random() * indices.length)]

  const clue1 = createClue(clues[index * 2])
  const clue2 = createClue(clues[index * 2 + 1])

  return { pair: [clue1, clue2], index }
}
