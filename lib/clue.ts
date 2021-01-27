import { Clue } from '../types/game.types'
import { randomInt } from '../util/number'
import { randomGradient } from './gradient-dict'

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
    ['Beautiful', 'Ugly'],
    ['Conventional thinking', 'Fringe theory'],
    ['Exciting', 'Boring'],
    ['Delusional', 'Rational'],
    ['Messy food', 'Clean food'],
    ['Worst living person', 'Best living person'],
    ['Role model', 'Bad influence'],
    ['Trashy', 'Classy'],
    ['Unpopular', 'Popular'],
    ['Round', 'Pointy'],
    ['Not sci-fi', 'Sci-fi'],
    ['Lowbrow', 'Highbrow'],
    ['Sci-fi', 'Fantasy'],
    ['Sad song', 'Happy song'],
    ['Job', 'Career'],
    ['Rough', 'Smooth'],
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
  const gradient = randomGradient()
  return { left: clues[0], right: clues[1], gradient }
}

export function randomClues(language: Language = 'en'): Clue[] {
  const i = randomInt(0, clues.en.length - 2)
  const c1 = createClue(clues[language][i])
  const c2 = createClue(clues[language][i + 1])
  return [c1, c2]
}
