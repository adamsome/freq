import {
  Clue,
  Command,
  CommandType,
  Game,
  GameView,
  Guess,
  Phase,
  Player,
  PlayerWithGuess,
} from '../types/game.types'
import { HasObjectID } from '../types/io.types'
import { partition } from '../util/array'
import { omitID } from '../util/mongodb'
import {
  doesGameHaveEnoughPlayers,
  getGamePsychic,
  getGuessInfo,
  getTeamName,
  isPlayerPsychic,
} from './game'
import { isFreePhase } from './phase'

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

function createAverageGuess(game: Game) {
  if (game.phase === 'choose' || game.phase === 'prep') return

  const guessingTeam = game.players.filter((p) => p.team === game.team_turn)
  const guesses = guessingTeam.reduce((acc, p) => {
    const guess = game.guesses?.[p.id]
    if (guess) {
      acc.push(guess.value)
    }
    return acc
  }, [] as number[])
  const sum = guesses.reduce((acc, g) => acc + g, 0)
  return sum / guesses.length
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

function showTarget(currentPlayer: Player, game: Game): boolean {
  if (isPlayerPsychic(currentPlayer.id, game)) {
    return true
  }
  if (isFreePhase(game.phase)) {
    return true
  }
  return false
}

function createCommands(
  player: Player,
  game: Game,
  averageGuess?: number
):
  | [Array<Command>, string, string]
  | [Array<Command>, string]
  | [Array<Command>] {
  const psychic = getGamePsychic(game)
  const playerGuess: Guess | undefined = game.guesses?.[player.id]
  const locked = playerGuess?.locked === true
  const turnTeamName = getTeamName(game.team_turn)
  const otherTeamName = getTeamName(game.team_turn === 1 ? 2 : 1)

  switch (game.phase) {
    case 'prep': {
      let info = 'Start game once all players have joined'
      if (player.leader && doesGameHaveEnoughPlayers(game)) {
        return [[{ type: 'begin_round', text: "Everyone's in" }], info]
      }
      info = "Leader will start game once everyone's in"
      return [[{ text: 'Waiting for players...', disabled: true }], info]
    }
    case 'choose': {
      if (player.id === psychic.id) {
        const disabled = game.clue_selected == null
        return [
          [{ type: 'confirm_clue', text: 'Confirm card', disabled }],
          disabled
            ? 'Tap an card above and think of a clue'
            : 'Have you thought of a good clue?',
        ]
      }
      const text = 'Waiting on the Phychic...'
      const info = `${psychic.icon} ${psychic.name} is thinking of a clue...`
      const infoColor = psychic.color ?? 'Gray'
      return [[{ disabled: true, text }], info, infoColor]
    }
    case 'guess': {
      if (player.id === psychic.id) {
        return [[{ disabled: true, text: 'Team is guessing...' }]]
      }
      if (player.team === game.team_turn) {
        const disabled = locked || playerGuess?.value == null
        const info = locked
          ? "Waiting for teammates' guesses"
          : 'Drag needle to guess where the clue is'
        const text = locked ? 'Locked in' : 'Lock it in'
        return [[{ type: 'lock_guess', text, disabled }], info]
      }
      return [[{ disabled: true, text: `${turnTeamName} is guessing...` }]]
    }
    case 'direction': {
      if (player.team !== game.team_turn) {
        const leftLocked = playerGuess?.value === -1
        const rightLocked = playerGuess?.value === 1
        const disabled = leftLocked || rightLocked
        const { numSet, numNeeded, guesses } = getGuessInfo(game, player.team)
        const partitionedGuesses = partition((g) => g.value === -1, guesses)
        const [numLeft, numRight] = partitionedGuesses.map((gs) => gs.length)
        const info = disabled
          ? `Waiting for teammates' picks (${numSet}/${numNeeded})`
          : `Guess which side of ${turnTeamName}'s ` +
            'average guess the real target is at'
        // TODO: Add `splitRight` and count what teammates chose
        const type: CommandType = 'set_direction'
        const text = disabled ? `Left (${numLeft})` : '⬅ Left'
        const rightWidth = 1 - (averageGuess ?? 0.5)
        const rightText = disabled ? `Right (${numRight})` : 'Right ➡'
        const rightCmd = { rightText, rightWidth, rightValue: 1 }
        return [[{ type, text, disabled, value: -1, ...rightCmd }], info]
      }
      return [[{ disabled: true, text: `${otherTeamName} is guessing...` }]]
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

  const averageGuess = createAverageGuess(game)

  const commandsTuple = createCommands(currentPlayer, game, averageGuess)
  const [commands, commandInfo, commandInfoColor] = commandsTuple

  const view: GameView & Partial<HasObjectID> = {
    ...game,
    currentPlayer,
    cluesToShow: createCluesToShow(phase, clues, clue_selected),
    playerGuesses: createPlayerNeedleGuesses(currentPlayer, game),
    canChangePsychicTo: canChangePsychicTo(game.phase),
    commandInfo: commandInfo ?? '',
    commands,
  }

  if (commandInfoColor) {
    view.commandInfoColor = commandInfoColor
  }

  if (averageGuess != null) {
    view.averageGuess = averageGuess
  }

  if (!showTarget(currentPlayer, game)) {
    delete view.target
  }

  return omitID(view)
}
