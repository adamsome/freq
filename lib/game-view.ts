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
import { HasObjectID } from '../types/io.types'
import { partition, range } from '../util/array'
import { getTeamColor } from './color-dict'
import {
  doesGameHaveEnoughPlayers,
  getNextPsychic,
  getPsychic,
  getTeamName,
} from './game'
import { calculateAverageGuess, getGuessInfo } from './guess'
import { getTeamIcon } from './icon'
import { isFreePhase } from './phase'
import { getRoundScores } from './score'

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
    if (isCurrentPlayer && game.psychic !== p.id) {
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

function showTarget(currentPlayer: Player, game: Game): boolean {
  if (game.psychic === currentPlayer.id) {
    return true
  }
  if (isFreePhase(game.phase)) {
    return true
  }
  return false
}

function getHourlyItem<T>(items: T[], index: number, changePerHour = 1): T {
  const now = new Date()
  const tick = now.getMinutes() + now.getHours() * 60 + now.getDate() * 24 * 60
  const cycle = Math.floor(tick / (60 / changePerHour))
  return items[(index + cycle) % items.length]
}

const SCORE_ICONS = [
  ['🤬', '🥵', '🥶', '😱', '😠', '😖', '😫'],
  ['🧐', '🤨', '😙'],
  ['😏', '😅', '🙃'],
  ['🥰', '😛', '😎', '😇', '🤓', '😼'],
  ['🤩', '🤪', '😜', '🥳', '😻', '🤠'],
]

const getEmoji = (score: number, i: number) =>
  getHourlyItem(SCORE_ICONS[score], i)

function getScoreMessages(scores: [number, number], i: number): Header[] {
  const [score1, score2] = scores
  const ss = scores.map((s) => (s === 1 ? '' : 's'))
  const teams = scores.map((_, i) => (i + 1) as 1 | 2)
  const names = teams.map(getTeamName)
  const colors = teams.map(getTeamColor)

  const [t1, t2] = names
  const [h1, h2] = scores
    .map((s, i) => `${names[i]} scored ${s} point${ss[i]} ${getEmoji(s, i)}!`)
    .map((text, i) => ({ text, color: colors[i] }))

  if (score1 === 0 && score2 === 0) {
    h1.text = `${t1} didn't score any points 😉!`
    h2.text = `Luckily neither did ${t2} 😆!`
  }
  if (score1 === 4 && score2 === 0) {
    h1.text = `${t1} got the full 4 points ${getEmoji(4, i)}👍!`
    h2.text = `${t2} got nothing 😭😭😭!`
  }
  if (score1 === 0 && score2 === 4) {
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
  player: Player,
  game: Game,
  averageGuess?: number
): CommandsView {
  const header: Header = { text: '', color: player.color }
  const cmd: Command = { text: '' }
  const view: CommandsView = { headers: [header], commands: [cmd] }

  const playerIndex = game.players.findIndex((p) => p.id === player.id) ?? 0
  const psychic = getPsychic(game)
  const isPsychic = psychic.id === player.id
  const psychicLabel = `${psychic.icon} ${psychic.name}`
  const playerGuess: Guess | undefined = game.guesses?.[player.id]
  const locked = playerGuess?.locked === true
  const turnTeamName = getTeamName(game.team_turn)
  const otherTeamName = getTeamName(game.team_turn === 1 ? 2 : 1)

  switch (game.phase) {
    case 'prep': {
      header.text = getHourlyItem(welcomeMessages, playerIndex)

      if (player.leader && doesGameHaveEnoughPlayers(game)) {
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
      if (isPsychic) {
        header.text = 'Choose a card & think of a clue!'

        cmd.type = 'confirm_clue'
        cmd.text = 'Confirm card'
        cmd.disabled = game.clue_selected == null
        cmd.info = cmd.disabled
          ? 'Tap an card above and think of a clue'
          : 'Have you thought of a good clue?'
        return view
      }

      header.text = `${psychicLabel} is thinking...!`
      header.color = psychic.color ?? 'Gray'

      cmd.text = 'Waiting on the Psychic...'
      cmd.info = `${psychicLabel} is picking & thinking of a clue...`
      cmd.infoColor = header.color
      cmd.disabled = true
      return view
    }
    case 'guess': {
      if (isPsychic) {
        header.text = 'Your team is guessing!'

        cmd.text = 'Team is guessing...'
        cmd.disabled = true
        return view
      }
      if (player.team === game.team_turn) {
        header.text = 'Guess where the target is!'

        cmd.type = 'lock_guess'
        cmd.info = locked
          ? "Waiting for teammates' guesses"
          : 'Drag needle to guess where the clue is'
        cmd.text = locked ? 'Locked in' : 'Lock it in'
        cmd.disabled = locked || playerGuess?.value == null
        return view
      }

      header.text = `${turnTeamName} team is guessing...`
      header.color = getTeamColor(game.team_turn)

      cmd.text = `Waiting on ${turnTeamName} team...`
      cmd.disabled = true
      return view
    }
    case 'direction': {
      const guessingTeam = game.team_turn === 1 ? 2 : 1
      const isGuessing = player.team === guessingTeam
      header.text = isGuessing
        ? 'Guess the direction!'
        : `${otherTeamName} is guessing the direction...`
      header.color = getTeamColor(guessingTeam)

      const leftLocked = playerGuess?.value === -1
      const rightLocked = playerGuess?.value === 1
      cmd.disabled = leftLocked || rightLocked || !isGuessing

      const { numSet, numNeeded, guesses } = getGuessInfo(
        game.players,
        game.psychic,
        game.guesses,
        guessingTeam
      )

      const partitionedGuesses = partition((g) => g.value === -1, guesses)
      const [numLeft, numRight] = partitionedGuesses.map((gs) => gs.length)

      cmd.info = !isGuessing
        ? `${otherTeamName} is guessing (${numSet}/${numNeeded})...`
        : cmd.disabled
        ? `Waiting for teammates' picks (${numSet}/${numNeeded})...`
        : `Guess which side of ${turnTeamName}'s ` +
          'average guess the real target is at'
      cmd.type = 'set_direction'
      cmd.text = cmd.disabled ? `Left (${numLeft})` : `⬅ Left (${numLeft})`
      cmd.value = -1
      cmd.rightValue = 1
      cmd.rightWidth = 1 - (averageGuess ?? 0.5)
      cmd.rightText = cmd.disabled
        ? `(${numRight}) Right`
        : `(${numRight}) Right ➡`
      return view
    }
    case 'reveal': {
      const [score1, score2] = getRoundScores(
        game.players,
        game.psychic,
        game.target_width,
        game.team_turn,
        game.guesses,
        game.target
      )

      view.headers = getScoreMessages([score1, score2], playerIndex)

      const nextPsychic = getNextPsychic(game, game.team_turn === 1 ? 2 : 1)
      const isNextPsychic = nextPsychic.id === player.id
      const canStart = isNextPsychic || player.leader === true
      const nextPsychicLabel = `${nextPsychic.icon} ${nextPsychic.name}`
      const nextPsychicText = isNextPsychic
        ? 'You are'
        : `${nextPsychicLabel} is`

      cmd.type = 'begin_round'
      cmd.text = canStart ? 'Start next round' : 'Wait for next round...'
      cmd.disabled = !canStart
      cmd.info = `${nextPsychicText} the Psychic next round!`
      cmd.infoColor = psychic.color ?? 'Gray'
      return view
    }
    case 'win': {
      const winningTeam = game.score_team_1 > game.score_team_2 ? 1 : 2
      const winningTeamName = getTeamName(winningTeam)
      const winningIcon = getTeamIcon(winningTeam)
      const icons = range(0, 3)
        .map(() => winningIcon)
        .join('')
      header.text = `${icons} ${winningTeamName} team wins! ${icons}`
      header.color = getTeamColor(winningTeam)

      const canStart = isPsychic || player.leader === true
      const nextPsychicText = isPsychic ? 'You are' : `${psychicLabel} is`

      cmd.type = 'begin_round'
      cmd.text = canStart ? 'Start a new match' : 'Wait for next match...'
      cmd.disabled = !canStart
      cmd.info = `${nextPsychicText} the Psychic next match!`
      cmd.infoColor = psychic.color ?? 'Gray'
      return view
    }
    default:
      return view
  }
}

export function toGameView(
  userID: string,
  game: Game & Partial<HasObjectID>,
  forceTarget = false
): GameView {
  const { phase, clues, clue_selected, players, team_turn, guesses } = game

  const currentPlayer = players.find((p) => p.id === userID)
  if (!currentPlayer) {
    throw new Error(
      `Unexpected error: Game has no player with user ID '${userID}'`
    )
  }

  const averageGuess = calculateAverageGuess(players, team_turn, guesses)

  const commandsView = createCommands(currentPlayer, game, averageGuess)

  const view: GameView & Partial<HasObjectID> = {
    ...game,
    ...commandsView,
    currentPlayer,
    cluesToShow: createCluesToShow(phase, clues, clue_selected),
    playerGuesses: createPlayerNeedleGuesses(currentPlayer, game),
    canChangePsychicTo: canChangePsychicTo(game.phase),
  }

  if (phase !== 'choose' && phase !== 'prep') {
    view.averageGuess = averageGuess
  }

  if (!forceTarget && !showTarget(currentPlayer, game)) {
    delete view.target
  }

  delete view._id
  return view
}
