import { BlowGame } from '../types/blow.types'
import { CommandType } from '../types/game.types'
import beginRound from './commands/begin-round'
import editPlayer from './commands/edit-player'
import kickPlayer from './commands/kick-player'
import prepNewMatch from './commands/prep-new-match'

export default async function handleBlowCommand(
  game: BlowGame,
  userID: string,
  type: CommandType,
  value?: unknown
) {
  switch (type) {
    // Player Commands
    case 'edit_player':
      return await editPlayer(game, userID, value)

    // TODO: Implement player shuffle
    // case 'shuffle_teams':
    //   return await shuffleTeams(game)

    case 'kick_player':
      return await kickPlayer(game, userID, value)

    // Phase Commands
    case 'prep_new_match':
      return await prepNewMatch(game, userID)

    case 'begin_round':
      return await beginRound(game)

    default:
      throw TypeError(`Cannot handle unsupported CWD command '${type}'.`)
  }
}
