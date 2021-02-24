import { OptionalId, WithId } from 'mongodb'
import {
  Clue,
  Command,
  CommandsView,
  Game,
  GameView,
  Guess,
  Header,
  Phase,
  Player,
  PlayerWithGuess,
} from '../types/game.types'
import { range } from '../util/array'
import { randomHourlyItem } from '../util/random'
import { getTeamColor } from './color-dict'
import {
  doesGameHaveEnoughPlayers,
  getNextPsychic,
  getPsychic,
  getTeamName,
} from './game'
import {
  calculateAverageNeedleGuess,
  getDirectionCounts,
  getDirectionGuessesNeeded,
  getGuessesLocked,
  getNeedleGuessesNeeded,
} from './guess'
import { getTeamIcon } from './icon'
import { isFreePhase } from './phase'
import { getPlayerDict, getTeamPlayers } from './player'
import { getScoreState } from './score'

function createPlayerNeedleGuesses(
  game: Game,
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

function createPlayerDirectionGuesses(game: Game): PlayerWithGuess[] {
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
    case 'choose':
    case 'reveal':
      return 'same_team'
    default:
      return 'none'
  }
}

function showTarget(game: Game, currentPlayer?: Player): boolean {
  if (!currentPlayer) return false
  if (game.psychic === currentPlayer.id) return true
  if (isFreePhase(game.phase)) return true
  return false
}

const SCORE_ICONS = [
  ['🤬', '🥵', '🥶', '😱', '😠', '😖', '😫'],
  ['🧐', '🤨', '😙'],
  ['😏', '😅', '🙃'],
  ['🥰', '😛', '😎', '😇', '🤓', '😼'],
  ['🤩', '🤪', '😜', '🥳', '😻', '🤠'],
]

const getEmoji = (score: number, i: number) =>
  randomHourlyItem(SCORE_ICONS[score], i)

function getScoreMessages(game: Game, i: number): Header[] {
  const { round } = getScoreState(game)
  const [score1, score2] = round
  const ss = round.map((s) => (s === 1 ? '' : 's'))
  const teams = round.map((_, i) => (i + 1) as 1 | 2)
  const names = teams.map(getTeamName)
  const colors = teams.map(getTeamColor)

  const [t1, t2] = names
  const [h1, h2] = round
    .map((s, i) => `${names[i]} scored ${s} point${ss[i]} ${getEmoji(s, i)}!`)
    .map((text, i) => ({ text, color: colors[i] }))

  if (score1 === 0 && score2 === 0) {
    h1.text = `${t1} didn't score any points 😉!`
    h2.text = `Luckily neither did ${t2} 😆!`
  }
  if (score1 === 4 && score2 === 0) {
    if (game.repeat_turn) {
      h1.text = `${t2} got 4 and go again since they're still losing 😲!!`
      return [h1]
    }
    h1.text = `${t1} got the full 4 points ${getEmoji(4, i)}👍!`
    h2.text = `${t2} got nothing 😭😭😭!`
  }
  if (score1 === 0 && score2 === 4) {
    if (game.repeat_turn) {
      h2.text = `${t2} got 4 and go again since they're still losing 😲!!`
      return [h2]
    }
    h1.text = `${t2} got the full 4 points ${getEmoji(4, i)}👍!`
    h1.color = colors[1]
    h2.text = `${t1} got nothing 😭😭😭!`
    h2.color = colors[0]
  }
  return [h1, h2]
}

const welcomeMessages = [
  'Well look who decided to join!',
  'Welcome, freq!',
  'Greetings, human!',
  'Hello there!',
  "We're glad you could finally make it!",
  'Hey look who it is!',
  'Do you believe in mind control??',
  'A most humble greetings!',
  'Cheers mate!',
  'Finally, now we can begin!',
  "If it isn't ... you!",
  'Welcome to the land of psychic powers!',
  'You may enter!',
]

function createCommands(
  game: Game,
  player?: Player,
  averageGuess?: number
): CommandsView {
  const header: Header = { text: '', color: player?.color }
  const cmd: Command = { text: '' }
  const view: CommandsView = { headers: [header], commands: [cmd] }

  if (!player) return view

  const playerIndex = game.players.findIndex((p) => p.id === player.id) ?? 0
  const turnTeamName = getTeamName(game.team_turn)
  const otherTeamName = getTeamName(game.team_turn === 1 ? 2 : 1)
  const enoughPlayers = doesGameHaveEnoughPlayers(game)

  switch (game.phase) {
    case 'prep': {
      header.text = randomHourlyItem(welcomeMessages, playerIndex)
      header.colorLit = 0.25

      if (player.leader && enoughPlayers) {
        cmd.type = 'begin_round'
        cmd.text = "Everyone's in"
        cmd.info = 'Start game once all players have joined'
        return view
      }

      cmd.text = 'Waiting for players...'
      cmd.disabled = true
      cmd.info = player.leader
        ? 'You can begin the game once at least 2 players are on each team'
        : "Leader will start game once everyone's in"
      return view
    }
    case 'choose': {
      const psychic = getPsychic(game) ?? player
      if (psychic.id === player.id) {
        header.text = 'Choose a card & think of a clue!'
        header.colorLit = 0.25

        cmd.type = 'confirm_clue'
        cmd.text = 'Confirm card'
        cmd.disabled = game.clue_selected == null
        cmd.info = cmd.disabled
          ? 'Tap an card above and think of a clue'
          : 'Have you thought of a good clue?'
        return view
      }

      const psychicLabel = `${psychic.icon} ${psychic.name}`
      header.text = `${psychicLabel} is thinking...!`
      header.color = psychic.color ?? 'Gray'

      cmd.text = 'Waiting on the Psychic...'
      cmd.info = `${psychicLabel} is picking a card & coming up with a clue...`
      cmd.infoColor = header.color
      cmd.disabled = true
      return view
    }
    case 'guess': {
      const psychic = getPsychic(game) ?? player
      const numSet = getGuessesLocked(game.guesses).length
      const numNeeded = getNeedleGuessesNeeded(game)
      const count = `(${numSet}/${numNeeded})`

      if (psychic.id === player.id) {
        header.text = 'Your teammates are guessing!'

        cmd.text = 'Team is guessing...'
        cmd.info = count
        cmd.disabled = true
        return view
      }

      const guess: Guess | undefined = game.guesses?.[player.id]
      const locked = guess?.locked === true

      if (player.team === game.team_turn) {
        header.text = 'Guess where the target is!'
        header.colorLit = 0.25

        cmd.type = 'lock_guess'
        cmd.info = locked
          ? `Waiting for teammates' guesses ${count}`
          : `Drag needle to guess where the clue is ${count}`
        cmd.text = locked ? 'Locked in' : 'Lock it in'
        cmd.disabled = locked || guess?.value == null
        return view
      }

      header.text = `${turnTeamName} team is guessing...`
      header.color = 'Gray'

      cmd.text = `Waiting on ${turnTeamName} team...`
      cmd.info = count
      cmd.disabled = true
      return view
    }
    case 'direction': {
      const guessingTeam = game.team_turn === 1 ? 2 : 1
      const isGuessing = player.team === guessingTeam

      header.text = isGuessing
        ? 'Guess the direction!'
        : `${otherTeamName} is guessing the direction...`
      if (!isGuessing) {
        header.color = 'Gray'
      } else {
        header.colorLit = 0.25
      }

      const numSet = getGuessesLocked(game.directions).length
      const numNeeded = getDirectionGuessesNeeded(game)
      const [numLeft, numRight] = getDirectionCounts(game.directions)
      const count = `(${numSet}/${numNeeded})`

      if (!isGuessing) {
        cmd.disabled = true
        cmd.text = `Waiting on ${turnTeamName} team...`
        cmd.disabled = true
        cmd.info = count
        return view
      }

      const guess: Guess | undefined = game.directions?.[player.id]
      const locked = guess?.locked === true
      const isValueSet = guess?.value === -1 || guess?.value === 1

      cmd.type = 'set_direction'
      cmd.text = cmd.disabled ? `Left (${numLeft})` : `⬅ Left (${numLeft})`
      cmd.disabled = locked
      cmd.value = -1
      cmd.rightValue = 1
      cmd.rightWidth = 1 - (averageGuess ?? 0.5)
      cmd.rightText = cmd.disabled
        ? `(${numRight}) Right`
        : `(${numRight}) Right ➡`

      const lockText = locked ? 'Locked in' : 'Lock it in'
      const lockCmd: Command = { text: lockText }
      lockCmd.type = 'lock_direction'
      lockCmd.disabled = !isValueSet || locked
      lockCmd.info = isValueSet
        ? `Waiting for teammates' picks ${count}...`
        : `Guess which side of ${turnTeamName}'s ` +
          'average guess the real target is at'

      view.commands = [cmd, lockCmd]
      return view
    }
    case 'reveal':
    case 'win': {
      if (game.phase === 'reveal') {
        view.headers = getScoreMessages(game, playerIndex)
      } else {
        const winningTeam = game.score_team_1 > game.score_team_2 ? 1 : 2
        const winningTeamName = getTeamName(winningTeam)
        const winningIcon = getTeamIcon(winningTeam)
        const icons = range(0, 3)
          .map(() => winningIcon)
          .join('')

        header.text = `${icons} ${winningTeamName} team wins! ${icons}`
        header.color = getTeamColor(winningTeam)
        header.colorLit = 0.25
      }

      const next = game.phase === 'reveal' ? 'round' : 'match'
      const nextPsychic = getNextPsychic(game) ?? getPsychic(game) ?? player
      const isNextPsychic = nextPsychic.id === player.id
      const canStart = isNextPsychic || player.leader === true
      const nextPsychicLabel = `${nextPsychic.icon} ${nextPsychic.name}`
      const nextPsychicText = isNextPsychic
        ? 'You are'
        : `${nextPsychicLabel} is`

      cmd.type = 'begin_round'
      cmd.text = canStart ? `Start next ${next}` : `Wait for next ${next}...`
      cmd.disabled = !canStart || !enoughPlayers
      cmd.info =
        canStart && !enoughPlayers
          ? `You can start next ${next} once at least 2 players are on each team`
          : `${nextPsychicText} the Psychic next ${next}!`
      cmd.infoColor = nextPsychic.color ?? 'Gray'
      return view
    }
    default:
      return view
  }
}

function getActivePlayers(game: Game): string[] {
  switch (game.phase) {
    case 'choose': {
      return [game.psychic]
    }
    case 'guess': {
      const { players, team_turn, psychic } = game
      return getTeamPlayers(players, team_turn, psychic)
        .filter((p) => !game.guesses?.[p.id]?.locked)
        .map((p) => p.id)
    }
    case 'direction': {
      const { players, team_turn } = game
      const otherTeam = team_turn === 1 ? 2 : 1
      return getTeamPlayers(players, otherTeam)
        .filter((p) => !game.directions?.[p.id]?.locked)
        .map((p) => p.id)
    }
  }
  return []
}

export function toGameView(
  id: string,
  game: OptionalId<WithId<Game>>,
  forceTarget = false
): GameView {
  const { phase, clues, clue_selected, players, guesses } = game

  const currentPlayer = players.find((p) => p.id === id)
  const averageGuess = calculateAverageNeedleGuess(guesses)
  const commandsView = createCommands(game, currentPlayer, averageGuess)

  const view: OptionalId<WithId<GameView>> = {
    ...game,
    ...commandsView,
    currentPlayer,
    cluesToShow: createCluesToShow(phase, clues, clue_selected),
    playerGuesses: createPlayerNeedleGuesses(game, currentPlayer),
    playerDirections: createPlayerDirectionGuesses(game),
    canChangePsychicTo: canChangePsychicTo(game.phase),
    activePlayers: getActivePlayers(game),
  }

  if (phase !== 'choose' && phase !== 'prep') {
    view.averageGuess = averageGuess
  }

  if (!forceTarget && !showTarget(game, currentPlayer)) {
    delete view.target
  }

  delete view._id
  return view
}
