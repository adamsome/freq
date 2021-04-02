import { FreqGame } from '../../types/freq.types'
import {
  Command,
  CommandsView,
  Guess,
  Header,
  Player,
} from '../../types/game.types'
import { partition, range } from '../../util/array'
import { randomHourlyItem } from '../../util/random'
import { getTeamColor } from '../color-dict'
import { doesGameHaveEnoughPlayers, getTeamName } from '../game'
import { getGuessesLocked } from '../guess'
import { getTeamIcon } from '../icon'
import { generateFreqRoundStats } from './freq-player-stats'
import { getNextPsychic, getPsychic } from './freq-psychic'
import {
  getDirectionCounts,
  getDirectionGuessesNeeded,
} from './guess-direction'
import { getNeedleGuessesNeeded } from './guess-needle'

export default function createFreqCommandsView(
  game: FreqGame,
  player?: Player,
  averageGuess?: number
): CommandsView {
  const header: Header = { text: '', color: player?.color }
  const cmd: Command = { text: '' }
  const view: CommandsView = { headers: [header], commands: [cmd] }

  const playerIndex = game.players.findIndex((p) => p.id === player?.id) ?? 0
  const turnTeamName = getTeamName(game.team_turn)
  const otherTeamName = getTeamName(game.team_turn === 1 ? 2 : 1)
  const enoughPlayers = doesGameHaveEnoughPlayers(game)

  switch (game.phase) {
    case 'prep': {
      header.text = randomHourlyItem(welcomeMessages, playerIndex)
      header.colorLit = 0.25

      if (!player) return view

      const shuffleCmd: Command = {
        text: 'Shuffle Teams',
        type: 'shuffle_teams',
        color: 'Gray',
      }

      if (player.leader && enoughPlayers) {
        cmd.type = 'begin_round'
        cmd.text = "Everyone's in"
        shuffleCmd.info = 'Start game once all players have joined'
      } else {
        cmd.text = 'Waiting for players...'
        cmd.disabled = true
        shuffleCmd.info = player.leader
          ? 'You can begin the game once at least 2 players are on each team'
          : "Leader will start game once everyone's in"
      }

      const [teamPlayers] = partition((p) => p.team != null, game.players)
      const playerCount = teamPlayers.length
      if (playerCount > 12) {
        cmd.info = shuffleCmd.info
        return view
      }

      view.commands = [cmd, shuffleCmd]
      return view
    }
    case 'choose': {
      const psychic = getPsychic(game) ?? player
      if (psychic?.id === player?.id) {
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

      const psychicLabel = `${psychic?.icon} ${psychic?.name ?? 'Noname'}`
      header.text = `${psychicLabel} is thinking...!`
      header.color = psychic?.color ?? 'Gray'

      if (!player) return view

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

      if (psychic?.id === player?.id) {
        header.text = 'Your teammates are guessing!'

        cmd.text = 'Team is guessing...'
        cmd.info = count
        cmd.disabled = true
        return view
      }

      const guess: Guess | undefined = player
        ? game.guesses?.[player.id]
        : undefined
      const locked = guess?.locked === true

      if (player?.team === game.team_turn) {
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

      if (!player) return view

      cmd.text = `Waiting on ${turnTeamName} team...`
      cmd.info = count
      cmd.disabled = true
      return view
    }
    case 'direction': {
      const guessingTeam = game.team_turn === 1 ? 2 : 1
      const isGuessing = player?.team === guessingTeam

      header.text = isGuessing
        ? 'Guess the direction!'
        : `${otherTeamName} is guessing the direction...`
      if (!isGuessing) {
        header.color = 'Gray'
      } else {
        header.colorLit = 0.25
      }

      if (!player) return view

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

      if (!player) return view

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

const SCORE_ICONS = [
  ['🤬', '🥵', '🥶', '😱', '😠', '😖', '😫'],
  ['🧐', '🤨', '😙'],
  ['😏', '😅', '🙃'],
  ['🥰', '😛', '😎', '😇', '🤓', '😼'],
  ['🤩', '🤪', '😜', '🥳', '😻', '🤠'],
]

const getEmoji = (score: number, i: number) =>
  randomHourlyItem(SCORE_ICONS[score], i)

function getScoreMessages(game: FreqGame, i: number): Header[] {
  const { scoreTeam1, scoreTeam2 } = generateFreqRoundStats(game)
  const round = [scoreTeam1, scoreTeam2]
  const ss = round.map((s) => (s === 1 ? '' : 's'))
  const teams = round.map((_, i) => (i + 1) as 1 | 2)
  const names = teams.map(getTeamName)
  const colors = teams.map(getTeamColor)

  const [t1, t2] = names
  const [h1, h2] = round
    .map((s, i) => `${names[i]} scored ${s} point${ss[i]} ${getEmoji(s, i)}!`)
    .map((text, i) => ({ text, color: colors[i] }))

  if (scoreTeam1 === 0 && scoreTeam2 === 0) {
    h1.text = `${t1} didn't score any points 😉!`
    h2.text = `Luckily neither did ${t2} 😆!`
  }
  if (scoreTeam1 === 4 && scoreTeam2 === 0) {
    if (game.repeat_turn) {
      h1.text = `${t2} got 4 and go again since they're still losing 😲!!`
      return [h1]
    }
    h1.text = `${t1} got the full 4 points ${getEmoji(4, i)}👍!`
    h2.text = `${t2} got nothing 😭😭😭!`
  }
  if (scoreTeam1 === 0 && scoreTeam2 === 4) {
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
