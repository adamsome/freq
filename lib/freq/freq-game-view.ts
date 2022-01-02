import { OptionalId, WithId } from 'mongodb'
import { canChangePsychicTo, isFreePhase } from '../phase'
import { getPlayerDict } from '../player'
import {
  CurrentFreqGameView,
  FreqClue,
  FreqGame,
  FreqGameView,
  FreqPhase,
} from '../types/freq.types'
import { Player, PlayerWithGuess } from '../types/game.types'
import createFreqCommandsView from './create-freq-commands-view'
import createFreqPlayerViews from './create-freq-player-views'
import { calculateAverageNeedleGuess } from './guess-needle'

function createPlayerNeedleGuesses(
  game: FreqGame,
  currentPlayer?: Player
): PlayerWithGuess[] {
  if (game.phase === 'choose' || game.phase === 'prep') {
    return []
  }

  const playerDict = getPlayerDict(game.players)

  const guessEntries = Object.entries(game.guesses ?? {})
  const guesses = guessEntries.map(([playerID, guess]) => {
    const player = playerDict[playerID]
    const playerWithGuess: PlayerWithGuess = { ...player, ...guess }
    return playerWithGuess
  })

  // If current player has no guess yet, create one for them
  if (
    currentPlayer &&
    game.phase === 'guess' &&
    currentPlayer.id !== game.psychic &&
    currentPlayer.team === game.team_turn &&
    !guesses.find((p) => p.id === currentPlayer.id)
  ) {
    guesses.push({ ...currentPlayer, value: 0.5 })
  }

  return guesses
}

function createPlayerDirectionGuesses(game: FreqGame): PlayerWithGuess[] {
  if (game.phase === 'choose' || game.phase === 'prep') {
    return []
  }

  const playerDict = getPlayerDict(game.players)

  const guessEntries = Object.entries(game.directions ?? {})
  return guessEntries.map(([playerID, guess]) => {
    const player = playerDict[playerID]
    const playerWithGuess: PlayerWithGuess = { ...player, ...guess }
    return playerWithGuess
  })
}

function createCluesToShow(
  phase: FreqPhase,
  clues: FreqClue[],
  selected?: number
): FreqClue[] {
  switch (phase) {
    case 'prep':
      return []
    case 'choose':
      return clues
    default:
      return selected != null ? [clues[selected]] : clues
  }
}

function showTarget(game: FreqGame, currentPlayer?: Player): boolean {
  if (!currentPlayer) return false
  if (game.psychic === currentPlayer.id) return true
  if (isFreePhase(game.phase)) return true
  return false
}

export function toFreqGameView(
  id: string | undefined,
  game: OptionalId<WithId<FreqGame>>,
  { forceTarget }: { forceTarget?: boolean } = {}
): FreqGameView {
  const players = createFreqPlayerViews(game, id)
  const currentPlayer = players.find((p) => p.id === id)
  const averageGuess = calculateAverageNeedleGuess(game.guesses)
  const commandsView = createFreqCommandsView(game, currentPlayer, averageGuess)

  const view: OptionalId<WithId<FreqGameView>> = {
    type: 'freq',
    ...game,
    ...commandsView,
    currentPlayer,
    players,
    cluesToShow: createCluesToShow(game.phase, game.clues, game.clue_selected),
    playerGuesses: createPlayerNeedleGuesses(game, currentPlayer),
    playerDirections: createPlayerDirectionGuesses(game),
    canChangePsychicTo: canChangePsychicTo(game.phase),
  }

  if (game.phase !== 'choose' && game.phase !== 'prep') {
    view.averageGuess = averageGuess
  }

  if (!forceTarget && !showTarget(game, currentPlayer)) {
    delete view.target
  }

  delete view._id
  return view
}

export function isCurrentFreqGameView(
  game: FreqGameView
): game is CurrentFreqGameView {
  return game.currentPlayer != null
}
