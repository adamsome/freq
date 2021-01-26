import {
  Clue,
  Command,
  Game,
  GameView,
  Phase,
  Player,
  PlayerWithGuess,
} from '../types/game.types'
import { HasObjectID } from '../types/io.types'
import { omitID } from '../util/mongodb'
import {
  doesGameHaveEnoughPlayers,
  getGamePsychic,
  getTeamName,
  isPlayerPsychic,
} from './game'

function createPlayerNeedleGuesses(
  currentPlayer: Player,
  game: Game
): PlayerWithGuess[] {
  if (game.phase === 'choose' || game.phase === 'prep') {
    return []
  }

  const guessingTeam = game.players.filter((p) => p.team === game.team_turn)

  return guessingTeam.reduce((acc, p) => {
    const guess = game.guesses?.[p.id]

    const isCurrentPlayer = p.id === currentPlayer.id
    if (isCurrentPlayer && !isPlayerPsychic(p.id, game)) {
      acc.push({ ...p, guess: guess ?? { value: 0.5 } })
    } else if (guess) {
      acc.push({ ...p, guess })
    }
    return acc
  }, [] as PlayerWithGuess[])
}

function createCluesToShow(
  phase: Phase,
  clues: Clue[],
  selected?: number
): Clue[] {
  switch (phase) {
    case 'prep':
      return []
    case 'choose':
      return clues
    default:
      return selected != null ? [clues[selected]] : clues
  }
}

function canChangePsychicTo(phase: Phase): GameView['canChangePsychicTo'] {
  switch (phase) {
    case 'prep':
    case 'win':
      return 'any'
    case 'reveal':
      return 'same_team'
    default:
      return 'none'
  }
}

function createCommands(
  player: Player,
  game: Game
): [Array<Command>, string] | [Array<Command>] {
  const psychic = getGamePsychic(game)
  switch (game.phase) {
    case 'prep': {
      if (player.leader && doesGameHaveEnoughPlayers(game)) {
        return [[{ type: 'begin_round', text: "Everyone's in" }]]
      }
      return [[{ text: 'Waiting for players...', waiting: true }]]
    }
    case 'choose': {
      if (player.id === psychic.id) {
        const disabled = game.clue_selected == null
        return [
          [{ type: 'confirm_clue', text: 'Confirm clue', disabled }],
          disabled
            ? 'Tap an option above and think of a clue'
            : 'Confirm when you are ready to give clue',
        ]
      }
      const text = `${psychic.icon} ${psychic.name} is choosing clue...`
      return [[{ waiting: true, text }]]
    }
    case 'guess': {
      if (player.id === psychic.id) {
        return [[{ waiting: true, text: 'Teammates are guessing...' }]]
      }
      if (player.team === game.team_turn) {
        const playerGuess = game.guesses?.[player.id]
        const locked = playerGuess?.locked === true
        const disabled = locked || playerGuess?.value == null
        const info = locked
          ? 'Waiting for teammates guesses'
          : 'Drag needle to guess where the clue is'
        const text = playerGuess?.locked ? 'Locked in' : 'Lock it in'
        return [[{ type: 'lock_guess', text, disabled }], info]
      }
      const text = `${getTeamName(game.team_turn)} team is guessing...`
      return [[{ waiting: true, text }]]
    }
    default:
      return [[]]
  }
}

export function toGameView(
  userID: string,
  game: Game & Partial<HasObjectID>
): GameView {
  const { phase, clues, clue_selected, players } = game

  const currentPlayer = players.find((p) => p.id === userID)
  if (!currentPlayer) {
    throw new Error(
      `Unexpected error: Game has no player with user ID '${userID}'`
    )
  }

  const cluesToShow = createCluesToShow(phase, clues, clue_selected)
  const playerGuesses = createPlayerNeedleGuesses(currentPlayer, game)
  const [commands, commandInfo] = createCommands(currentPlayer, game)

  const view: GameView & Partial<HasObjectID> = {
    ...game,
    currentPlayer,
    cluesToShow,
    playerGuesses,
    canChangePsychicTo: canChangePsychicTo(game.phase),
    commandInfo: commandInfo ?? '',
    commands,
  }
  return omitID(view)
}
