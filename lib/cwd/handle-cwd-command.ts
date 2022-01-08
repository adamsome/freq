import { FullCwdGameView } from '../types/cwd.types'
import { CommandType } from '../types/game.types'
import beginRound from './commands/begin-round'
import changePlayerTeam from './commands/change-player-team'
import editPlayer from './commands/edit-player'
import kickPlayer from './commands/kick-player'
import lockGuess from './commands/lock-guess'
import prepNewMatch from './commands/prep-new-match'
import setCurrentPsychic from './commands/set-current-psychic'
import setDesignatedPsychicMode from './commands/set-designated-psychic-mode'
import setGuess from './commands/set-guess'
import shuffleTeams from './commands/shuffle-teams'

export default async function handleCwdCommand(
  game: FullCwdGameView,
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
    case 'set_current_psychic':
      return await setCurrentPsychic(game, value)
    case 'set_designated_psychic_mode':
      return await setDesignatedPsychicMode(game, value)
    case 'kick_player':
      return await kickPlayer(game, value)
    // Phase Commands
    case 'prep_new_match':
      return await prepNewMatch(game)
    case 'begin_round':
      return await beginRound(game)
    case 'set_guess':
      return await setGuess(game, value)
    case 'lock_guess':
      return await lockGuess(game)
    default:
      throw TypeError(`Cannot handle unsupported CWD command '${type}'.`)
  }
}
