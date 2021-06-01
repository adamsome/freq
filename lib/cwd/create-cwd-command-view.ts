import { CwdGame } from '../../types/cwd.types'
import {
  Command,
  CommandsView,
  Guess,
  Header,
  PlayerView,
} from '../../types/game.types'
import { partition, range } from '../../util/array'
import { randomHourlyItem } from '../../util/random'
import { getTeamColor } from '../color-dict'
import { doesGameHaveEnoughPlayers, getTeamName } from '../game'
import { getTeamIcon } from '../icon'
import getCwdWinner from './get-cwd-winner'

export default function createCwdCommandView(
  game: CwdGame,
  player?: PlayerView
): CommandsView {
  const header: Header = { text: '', color: player?.color }
  const cmd: Command = { text: '' }
  const view: CommandsView = { headers: [header], commands: [cmd] }

  const playerIndex = game.players.findIndex((p) => p.id === player?.id) ?? 0
  const turnTeamName = getTeamName(game.team_turn)
  const otherTeamName = getTeamName(game.team_turn === 1 ? 2 : 1)
  const enoughPlayers = doesGameHaveEnoughPlayers(game, 'cwd')

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

      if (enoughPlayers && game.psychic_1 && game.psychic_2) {
        cmd.type = 'begin_round'
        cmd.text = "Everyone's in"
        shuffleCmd.info = 'Start game once all players have joined.'
      } else {
        cmd.text = 'Waiting for players...'
        cmd.disabled = true
        shuffleCmd.info = !enoughPlayers
          ? 'You can begin the game once at least 2 players are on each team.'
          : !game.psychic_1
          ? 'Red team needs a psychic before the match can start.'
          : 'Blue team needs a psychic before the match can start.'
      }

      const [teamPlayers] = partition((p) => p.team != null, game.players)
      let playerCount = teamPlayers.length
      playerCount -= game.settings?.designated_psychic ? 1 : 0
      if (playerCount > 12) {
        cmd.info = shuffleCmd.info
        return view
      }

      view.commands = [cmd, shuffleCmd]
      return view
    }
    case 'guess': {
      const psychic = game.team_turn === 1 ? game.psychic_1 : game.psychic_2

      const guesses =
        game.team_turn === 1 ? game.team_1_guesses : game.team_2_guesses
      const otherTeamGuesses =
        game.team_turn === 1 ? game.team_2_guesses : game.team_1_guesses

      const isFirstGuessInRound = guesses.length === 0
      const isFirstGuessInMatch =
        isFirstGuessInRound && otherTeamGuesses.length === 0

      let result: GuessResult | undefined

      if (!isFirstGuessInMatch) {
        if (!isFirstGuessInRound) {
          result = 'hit'
        } else {
          const lastGuessIndex = otherTeamGuesses[otherTeamGuesses.length - 1]
          const lastGuessState = game.code_states[lastGuessIndex]
          result = lastGuessState === 0 ? 'miss' : 'opponent'
        }
      }

      const icon =
        result && randomHourlyItem(GUESS_RESULT_ICONS[result], playerIndex)

      const guess: Guess | undefined = player
        ? game.guesses?.[player.id]
        : undefined
      const locked = guess?.locked === true

      if (player?.team === game.team_turn || player?.designatedPsychic) {
        if (psychic === player?.id) {
          header.text = icon ?? '👁'
        } else {
          header.text = icon ?? '🕵️'
        }

        header.colorLit = 0.25

        if (game.team_turn === 1) {
          cmd.type = 'lock_guess'
          cmd.text = locked ? 'Locked in' : 'Lock it in'
          cmd.disabled = locked || guess?.value == null

          const otherPsychicColor = game.players.find(
            (p) =>
              p.id === (game.team_turn === 1 ? game.psychic_2 : game.psychic_1)
          )?.color

          cmd.rightText = `Pass to ${otherTeamName}`
          cmd.rightType = 'begin_round'
          cmd.rightColor = otherPsychicColor
          cmd.rightWidth = 0.1
          cmd.rightDisabled = false
        } else {
          cmd.rightType = 'lock_guess'
          cmd.rightText = locked ? 'Locked in' : 'Lock it in'
          cmd.rightDisabled = locked || guess?.value == null
          cmd.rightWidth = 0.9

          const otherPsychicColor = game.players.find(
            (p) =>
              p.id === (game.team_turn === 1 ? game.psychic_2 : game.psychic_1)
          )?.color

          cmd.text = `Pass to ${otherTeamName}`
          cmd.type = 'begin_round'
          cmd.color = otherPsychicColor
          cmd.disabled = false
        }

        cmd.info =
          psychic === player?.id
            ? 'Team is guessing the codes using your clue word & number.'
            : `Tap a code & lock it in —or— end the round and pass.`

        view.commands = [cmd]
        return view
      }

      header.text = icon ?? '⛱'
      header.color = 'Gray'

      if (!player) return view

      cmd.text = `Waiting on ${turnTeamName} team...`
      cmd.disabled = true
      return view
    }
    case 'win': {
      const winningTeam = getCwdWinner(game)
      const winningTeamName = getTeamName(winningTeam)
      const winningIcon = getTeamIcon(winningTeam)
      const icons = range(0, 3)
        .map(() => winningIcon)
        .join('')

      header.text = `${icons} ${winningTeamName} team wins! ${icons}`
      header.color = getTeamColor(winningTeam)
      header.colorLit = 0.25

      if (!player) return view

      cmd.type = 'prep_new_match'
      cmd.text = 'New Match'
      return view
    }
    default:
      return view
  }
}
type GuessResult = 'hit' | 'miss' | 'opponent' | 'scratch'

const GUESS_RESULT_ICONS: Record<GuessResult, string[]> = {
  hit: ['🥰', '😛', '😎', '😇', '🤓', '😼', '🤩', '🤪', '😜', '🥳', '😻', '🤠'],
  miss: ['😖', '🧐', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😠'],
  opponent: ['😫', '😩', '🥺', '😭', '😤', '😬', '🙄', '😓', '😲', '😮'],
  scratch: ['🤬', '🤯', '🥵', '🥶', '😱', '🤮', '🤢', '☠️', '🙀'],
}

const welcomeMessages = [
  'Well look who decided to join!',
  'Welcome, you!',
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
