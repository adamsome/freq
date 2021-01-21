import { Clue } from '../types/game.types'
import { randomItem } from '../util/array'
import { randomInt } from '../util/number'
import { objectKeys } from '../util/object'
import gradientDict from './gradient'

type Language = 'en'

const clues: Record<Language, string[][]> = {
  en: [
    ['Cold', 'Hot'],
    ['Square', 'Hip'],
    ['Overrated Movie', 'Underrated Movie'],
    ['Expected', 'Unexpected'],
    ['Overrated Movie', 'Underrated Movie'],
    ['Expected', 'Unexpected'],
    ['Sad', 'Happy'],
    ['Dark', 'Light'],
    ['Person you could beat up', 'Person who’d beat you up'],
    ['Worst era to time travel', 'Best era to time travel'],
    ['Messy food', 'Clean food'],
    ['Worst living person', 'Best living person'],
    ['Role model', 'Bad influence'],
    ['Trashy', 'Classy'],
    ['Unpopular', 'Popular'],
    ['Round', 'Pointy'],
    ['Not sci-fi', 'Sci-fi'],
    ['Lowbrow', 'Highbrow'],
    ['Good', 'Evil'],
    ['Cool', 'Uncool'],
    ['Inflexible', 'Flexible'],
    ['Guilty pleasure', 'Openly love'],
    ['Ugly man', 'Beautiful man'],
    ['Low quality', 'High quality'],
    ['Bad superpower', 'Good superpower'],
    ['Book was better', 'Movie was better'],
    ['Quiet place', 'Loud place'],
    ['Feels bad', 'Feels good'],
    ['Dictatorship', 'Democracy'],
    ['Useless invention', 'Useful invention'],
  ],
}

function createClue(clues: string[]): Clue {
  const gradient = randomItem(objectKeys(gradientDict))
  return { left: clues[0], right: clues[1], gradient }
}

export function createClues(language: Language = 'en'): Clue[] {
  const i = randomInt(0, clues.en.length - 2)
  const c1 = createClue(clues[language][i])
  const c2 = createClue(clues[language][i + 1])
  return [c1, c2]
}
