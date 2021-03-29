import { CwdGame } from '../../types/cwd.types'
import {
  Command,
  CommandsView,
  Guess,
  Header,
  PlayerView,
} from '../../types/game.types'
import { range } from '../../util/array'
import { randomHourlyItem } from '../../util/random'
import { getTeamColor } from '../color-dict'
import { doesGameHaveEnoughPlayers, getTeamName } from '../game'
import { getTeamIcon } from '../icon'

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
  const enoughPlayers = doesGameHaveEnoughPlayers(game)

  switch (game.phase) {
    case 'prep': {
      header.text = randomHourlyItem(welcomeMessages, playerIndex)
      header.colorLit = 0.25

      if (!player) return view

      if (enoughPlayers && game.psychic_1 && game.psychic_2) {
        cmd.type = 'begin_round'
        cmd.text = "Everyone's in"
        cmd.info = 'Start game once all players have joined.'
        return view
      }

      cmd.text = 'Waiting for players...'
      cmd.disabled = true
      cmd.info = !enoughPlayers
        ? 'You can begin the game once at least 2 players are on each team.'
        : !game.psychic_1
        ? 'Red team needs a psychic before the match can start.'
        : 'Blue team needs a psychic before the match can start.'
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

      if (psychic === player?.id) {
        header.text = icon ?? '👁'

        cmd.text = 'You are the Codemaster...'
        cmd.info = 'Team is guessing the codes using your clue word & number.'
        cmd.disabled = true
        return view
      }

      const guess: Guess | undefined = player
        ? game.guesses?.[player.id]
        : undefined
      const locked = guess?.locked === true

      if (player?.team === game.team_turn) {
        header.text = icon ?? '🕵️'
        header.colorLit = 0.25

        cmd.type = 'lock_guess'
        cmd.text = locked ? 'Locked in' : 'Lock it in'
        cmd.disabled = locked || guess?.value == null

        const passCmd: Command = { text: `Pass to ${otherTeamName}` }
        passCmd.type = 'begin_round'
        passCmd.info = `Tap a code & lock it in --or-- end the round and pass.`

        view.commands = [cmd, passCmd]
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
      const winningTeam = game.score_team_1 === 0 ? 1 : 2
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
