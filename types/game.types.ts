export interface Player {
  id: string
  name?: string
  team?: 1 | 2
  color?: string
  icon?: string
  leader?: boolean
  fetching?: boolean
}

export interface Guess {
  value: number
  locked?: boolean
}

export type PlayerWithGuess = Player & Guess

export type ScoreType = 'points' | 'wins'

export interface Header {
  text: string
  color?: string
  colorLit?: number
}

export interface Command<T extends string> {
  text: string
  type?: T
  disabled?: boolean
  color?: string
  rightText?: string
  value?: any
  rightValue?: any
  /** Percent width the right-side command should have */
  rightWidth?: number
  rightColor?: string
  info?: string
  infoColor?: string
  fetching?: boolean
}

export interface CommandsView<T extends string> {
  headers: Header[]
  commands: Command<T>[]
}

export type LanguageCode = 'en'
