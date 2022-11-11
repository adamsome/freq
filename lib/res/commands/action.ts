import { UpdateFilter } from 'mongodb'
import invariant from 'tiny-invariant'
import {
  ResAction,
  ResActionID,
  ResGame,
  RES_ACTIONS_ID,
} from '../../types/res.types'
import { connectToDatabase } from '../../util/mongodb'
import { isObject } from '../../util/object'
import { isNotEmpty } from '../../util/string'
import {
  revealResVote,
  selectResTeamMember,
  startResTeamSelect,
  startResTeamVote,
  voteResTeam,
} from '../res-engine'
import { fromResGames } from '../res-game-store'

function isResAction(action: unknown): action is ResAction {
  return (
    isObject(action) &&
    isNotEmpty(action.type) &&
    RES_ACTIONS_ID.includes(action.type as ResActionID)
  )
}

function getActionChanges(
  game: ResGame,
  userID: string,
  action: ResAction
): UpdateFilter<ResGame> | undefined {
  switch (action.type) {
    case 'start_team_select': {
      return startResTeamSelect(game, userID)
    }
    case 'select_team_player': {
      const teamMemberID = action.payload
      invariant(
        typeof teamMemberID === 'string',
        `Team member ID '${teamMemberID}' to select is invalid`
      )
      return selectResTeamMember(game, userID, teamMemberID)
    }
    case 'start_team_vote': {
      return startResTeamVote(game, userID)
    }
    case 'vote_team': {
      const vote = action.payload
      invariant(typeof vote === 'boolean', 'Team vote is invalid')
      return voteResTeam(game, userID, vote)
    }
    case 'reveal_vote': {
      return revealResVote(game)
    }
  }

  throw new Error(`Res action '${action.type}' not supported`)
}

export default async function actionCommand(
  game: ResGame,
  userID: string,
  action: unknown
): Promise<void> {
  if (!isResAction(action)) throw new Error('Action is invalid.')

  if (game.phase !== 'guess') throw new Error('Can only do action during game.')

  const changes = getActionChanges(game, userID, action)

  if (changes != null && Object.keys(changes).length !== 0) {
    const { db } = await connectToDatabase()
    const filter = { room: game.room.toLowerCase() }
    await fromResGames(db).updateOne(filter, changes)
  }
}
