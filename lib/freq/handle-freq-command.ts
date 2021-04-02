import { CurrentFreqGameView } from '../../types/freq.types'
import { CommandType } from '../../types/game.types'
import beginRound from './commands/begin-round'
import changePlayerTeam from './commands/change-player-team'
import confirmClue from './commands/confirm-clue'
import editPlayer from './commands/edit-player'
import kickPlayer from './commands/kick-player'
import lockDirection from './commands/lock-direction'
import lockGuess from './commands/lock-guess'
import prepNewMatch from './commands/prep-new-match'
import revealMatchResults from './commands/reveal-match-results'
import revealRoundResults from './commands/reveal-round-results'
import selectClue from './commands/select-clue'
import setCurrentPsychic from './commands/set-current-psychic'
import setDirection from './commands/set-direction'
import setGuess from './commands/set-guess'
import setNextPsychic from './commands/set-next-psychic'
import shuffleTeams from './commands/shuffle-teams'
import togglePlayerLeader from './commands/toggle-player-leader'

export default async function handleFreqCommand(
  game: CurrentFreqGameView,
  type: CommandType,
  value?: unknown
) {
  switch (type) {
    // Player Commands
    case 'change_player_team':
      return await changePlayerTeam(game, value)
    case 'shuffle_teams':
      return await shuffleTeams(game)
    case 'edit_player':
      return await editPlayer(game, value)
    case 'toggle_player_leader':
      return await togglePlayerLeader(game, value)
    case 'set_next_psychic':
      return await setNextPsychic(game, value)
    case 'set_current_psychic':
      return await setCurrentPsychic(game, value)
    case 'kick_player':
      return await kickPlayer(game, value)
    // Phase Commands
    case 'prep_new_match':
      return await prepNewMatch(game)
    case 'begin_round':
      return await beginRound(game)
    case 'select_clue':
      return await selectClue(game, value)
    case 'confirm_clue':
      return await confirmClue(game)
    case 'set_guess':
      return await setGuess(game, value)
    case 'lock_guess':
      return await lockGuess(game)
    case 'set_direction':
      return await setDirection(game, value)
    case 'lock_direction':
      return await lockDirection(game)
    case 'reveal_round_results':
      return await revealRoundResults(game)
    case 'reveal_match_results':
      return await revealMatchResults(game)
    default:
      throw TypeError(`Cannot handle unsupported CWD command '${type}'.`)
  }
}
