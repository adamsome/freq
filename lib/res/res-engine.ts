import { UpdateFilter } from 'mongodb'
import invariant from 'tiny-invariant'
import { Player } from '../types/game.types'
import {
  ResGame,
  ResGameView,
  ResRound,
  ResRoundStatus,
  ResVoteStatus,
} from '../types/res.types'
import { User } from '../types/user.types'
import { partition, range } from '../util/array'
import { shuffle } from '../util/random'

// Required counts/sizes

const RES_SPY_COUNT_BY_PLAYER_COUNT: Record<number, number> = {
  5: 2,
  6: 2,
  7: 3,
  8: 3,
  9: 3,
  10: 4,
}

export function getResSpyCountRequired(playerCount: number): number {
  const spyCount = RES_SPY_COUNT_BY_PLAYER_COUNT[playerCount]
  invariant(
    spyCount != null,
    `No valid spy count for player count '${playerCount}'`
  )
  return spyCount
}

const RES_TEAM_SIZE: Record<number, number[]> = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
}

export function getResTeamSizeRequired(
  playerCount: number,
  roundIndex: number
): number {
  const sizePerRound = RES_TEAM_SIZE[playerCount]
  invariant(
    sizePerRound != null,
    `No mission team size for player count '${playerCount}'`
  )
  const size = sizePerRound[roundIndex]
  invariant(
    size != null,
    `No mission team size for round index '${roundIndex}'`
  )
  return size
}

// Rounds

export function getResRoundStatus(
  game: ResGame,
  roundIndex: number
): ResRoundStatus {
  const round = game.rounds[roundIndex]
  if (game.phase !== 'guess' || !round) {
    return 'unplayed'
  }
  const playerCount = game.players.length
  const teamSize = getResTeamSizeRequired(playerCount, roundIndex)
  const results = round.result.filter((res) => res !== null)
  invariant(
    results.length <= teamSize,
    'Round result count cannot be greater than mission team size'
  )
  if (results.length === teamSize) {
    return results.every((r) => r === true) ? 'success' : 'failure'
  }
  return 'current'
}

export function getResRoundIndex(game: ResGame): number {
  const roundCount = game.rounds.length
  invariant(roundCount > 0, 'Match requires at least one round')
  return game.rounds.length - 1
}

export function getResRoundAndIndex(
  game: ResGame
): readonly [ResRound, number] {
  const roundIndex = getResRoundIndex(game)
  const round = game.rounds[roundIndex]
  return [round, roundIndex] as const
}

export function getResRound(game: ResGame): ResRound {
  const [round] = getResRoundAndIndex(game)
  return round
}

// Players

function getPlayerIndex(
  game: ResGame,
  userOrID: string | Player | User
): number {
  const userID = typeof userOrID === 'string' ? userOrID : userOrID.id
  const index = game.players.findIndex((p) => p.id === userID)
  invariant(index >= 0, `Player '${userID}' not in match`)
  return index
}

export function getResPlayersInOrder(game: ResGame): Player[] {
  return game.player_order.map((i) => game.players[i])
}

export function getResLead(game: ResGame): Player {
  const round = getResRound(game)
  const lead = game.players[round.lead]
  invariant(lead, 'Round lead not in the match')
  return lead
}

export function isResLead(
  game: ResGame,
  userOrID?: string | Player | User
): boolean {
  if (userOrID == null) {
    return false
  }
  const userID = typeof userOrID === 'string' ? userOrID : userOrID.id
  return getResLead(game).id === userID
}

export function isCurrentPlayerResLead(game: ResGameView): boolean {
  const lead = getResLead(game)
  return lead.id === game.currentPlayer?.id
}

export function isResSpy(
  game: ResGameView,
  userOrID?: string | Player | User
): boolean {
  if (userOrID == null) {
    return false
  }
  const userID = typeof userOrID === 'string' ? userOrID : userOrID.id
  return game.spies.map((i) => game.players[i]).some((p) => p.id === userID)
}

function getNextResLeadIndex(game: ResGame): number {
  const round = getResRound(game)
  const leadIndex = round.lead
  const playerOrderIndex = game.player_order.findIndex((i) => i === leadIndex)
  invariant(playerOrderIndex >= 0, 'Lead not found in player order')
  const playerCount = game.player_order.length
  const playerIndex = game.player_order[(playerOrderIndex + 1) % playerCount]
  return playerIndex
}

// Team

function getResTeamSelectIndex(game: ResGame): number {
  if (game.phase !== 'guess') {
    return 0
  }
  const round = getResRound(game)
  const teamSelectIndex = round.team.length - 1
  invariant(teamSelectIndex >= 0, 'No team selections exists')
  return teamSelectIndex
}

function getResTeamMemberIndices(game: ResGame): number[] {
  const round = getResRound(game)
  const teamSelectIndex = getResTeamSelectIndex(game)
  return round.team[teamSelectIndex]
}

export function getResTeamSize(game: ResGame): number {
  if (game.phase !== 'guess' || game.step === 'spy_reveal') {
    return 0
  }
  const teamMemberIndices = getResTeamMemberIndices(game)
  return teamMemberIndices.length
}

export function getResTeamMembers(game: ResGame): Player[] {
  const teamMemberIndices = getResTeamMemberIndices(game)
  const teamMembers = teamMemberIndices.map((i) => game.players[i])
  invariant(
    teamMembers.every((m) => m),
    'Team member not in match'
  )
  return teamMembers
}

function findTeamMemberIndex(
  game: ResGame,
  userOrID: string | Player | User
): number {
  const userID = typeof userOrID === 'string' ? userOrID : userOrID.id
  const teamMembers = getResTeamMembers(game)
  return teamMembers.findIndex((m) => m.id === userID)
}

export function isResTeamMember(
  game: ResGame,
  userOrID: string | Player | User
): boolean {
  if (game.phase !== 'guess' || game.step === 'spy_reveal') {
    return false
  }
  const teamMemberIndex = findTeamMemberIndex(game, userOrID)
  return teamMemberIndex >= 0
}

export function isResTeamRequiredSize(game: ResGame): boolean {
  const playerCount = game.players.length
  const roundIndex = getResRoundIndex(game)
  const teamSizeRequired = getResTeamSizeRequired(playerCount, roundIndex)
  const teamSize = getResTeamSize(game)
  return teamSize === teamSizeRequired
}

// Votes

function getResVoteRoundIndex(game: ResGame): number {
  if (game.phase !== 'guess') {
    return 0
  }
  const round = getResRound(game)
  const voteRoundIndex = round.votes.length - 1
  invariant(voteRoundIndex >= 0, 'No voting rounds exists')
  return voteRoundIndex
}

export function getResVotesAndIndex(
  game: ResGame
): readonly [(boolean | null)[], number] {
  if (game.phase !== 'guess') {
    return [[], 0]
  }
  const round = getResRound(game)
  const voteRoundIndex = getResVoteRoundIndex(game)
  invariant(voteRoundIndex >= 0, 'No voting rounds exists')
  const votes = round.votes[voteRoundIndex]
  return [votes, voteRoundIndex]
}

export function getResRejectedVoteRounds(
  game: ResGame,
  roundIndex: number
): number {
  const round = game.rounds[roundIndex]
  if (round && round.votes.length > 0) {
    return round.votes.length - 1
  }
  return 0
}

function getResVotes(game: ResGame): (boolean | null)[] {
  const [votes] = getResVotesAndIndex(game)
  return votes
}

export function getResCastVotes(game: ResGame): boolean[] {
  const votes = getResVotes(game)
  return votes.filter((v) => v !== null) as boolean[]
}

export function isResVoteComplete(game: ResGame): boolean {
  const playerCount = game.players.length
  const votesCast = getResCastVotes(game)
  return votesCast.length === playerCount
}

export function getResVotesApprovedAndRejected(
  game: ResGame
): readonly [number, number] {
  const castVotes = getResCastVotes(game)
  const [approved, rejected] = partition((vote) => vote === true, castVotes)
  return [approved.length, rejected.length]
}

export function isResVoteApproved(game: ResGame): boolean {
  if (!isResVoteComplete(game)) {
    return false
  }
  const [approved, rejected] = getResVotesApprovedAndRejected(game)
  return approved > rejected
}

export function isResVoteRejected(game: ResGame): boolean {
  if (!isResVoteComplete(game)) {
    return false
  }
  return !isResVoteApproved(game)
}

export function getResPlayerVote(
  game: ResGame,
  userOrID?: string | Player | User
): boolean | null {
  if (userOrID == null) {
    return null
  }
  const playerIndex = getPlayerIndex(game, userOrID)
  const votes = getResVotes(game)
  const playerVote = votes[playerIndex]
  invariant(playerVote !== undefined, 'Player vote invalid')
  return playerVote
}

export function getResPlayerVoteStatus(
  game: ResGame,
  userOrID?: string | Player | User
): ResVoteStatus | undefined {
  if (game.phase === 'guess') {
    switch (game.step) {
      case 'team_vote': {
        const vote = getResPlayerVote(game, userOrID)
        return vote === null ? 'notVoted' : 'voted'
      }
      case 'team_vote_reveal':
      case 'mission':
      case 'mission_reveal': {
        const vote = getResPlayerVote(game, userOrID)
        return vote ? 'approve' : 'reject'
      }
    }
  }
}

// Actions

/**
 * To start a match a subset of players are assigned as spies with
 * the following distribution:
 *
 * | Players | 5 | 6 | 7 | 8 | 9 | 10 |
 * | ------- | - | - | - | - | - | -- |
 * | Spies   | 2 | 2 | 3 | 3 | 3 | 4  |
 */
export function generateResSpies(game: ResGame): number[] {
  const count = getResSpyCountRequired(game.players.length)
  const playerIndices = game.players.map((_, i) => i)
  const shuffledPlayerIndices = shuffle(playerIndices)
  return shuffledPlayerIndices.slice(0, count)
}

export function startResTeamSelect(
  game: ResGame,
  userID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' &&
      (game.step === 'spy_reveal' ||
        (game.step === 'team_vote_reveal' && isResVoteRejected(game))),
    'Can only start team select from spy reveal or rejected vote reveal steps'
  )
  invariant(
    isResLead(game, userID),
    `Lead must start mission team vote. Player '${userID}' is not lead.`
  )

  const roundIndex = getResRoundIndex(game)
  const teamSelectionsPath = `rounds.${roundIndex}.team`
  const voteRoundsPath = `rounds.${roundIndex}.votes`
  const playerCount = game.players.length
  const newVotes = range(playerCount).map(() => null)

  return {
    $set: {
      step: 'team_select',
    },
    $push: {
      [teamSelectionsPath]: [],
      [voteRoundsPath]: newVotes,
    },
  }
}

export function selectResTeamMember(
  game: ResGame,
  userID: string,
  teamMemberID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' && game.step === 'team_select',
    'Can only select team member in team select step'
  )
  invariant(
    isResLead(game, userID),
    `Only lead can select mission team member. Player '${userID}' is not lead.`
  )
  const isTeamMember = isResTeamMember(game, teamMemberID)
  invariant(
    isTeamMember ? true : !isResTeamRequiredSize(game),
    'Team is already at required size'
  )

  const roundIndex = getResRoundIndex(game)
  const teamSelectIndex = getResTeamSelectIndex(game)
  const roundTeamSelectPath = `rounds.${roundIndex}.team.${teamSelectIndex}`
  const playerIndex = getPlayerIndex(game, teamMemberID)
  return {
    [isTeamMember ? '$pull' : '$push']: {
      [roundTeamSelectPath]: playerIndex,
    },
  }
}

export function startResTeamVote(
  game: ResGame,
  userID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' && game.step === 'team_select',
    'Can only start team vote from the team select step'
  )
  invariant(
    isResLead(game, userID),
    `Lead must start mission team vote. Player '${userID}' is not lead.`
  )
  invariant(
    isResTeamRequiredSize(game),
    'Selected team size not ready for vote'
  )
  return {
    $set: {
      step: 'team_vote',
    },
  }
}

export function voteResTeam(
  game: ResGame,
  userID: string,
  vote: boolean
): UpdateFilter<ResGame> | undefined {
  invariant(
    game.phase === 'guess' && game.step === 'team_vote',
    'Can only vote in the team vote step'
  )

  const alreadyVoted = getResPlayerVote(game, userID) !== null
  if (alreadyVoted) {
    return
  }

  const roundIndex = getResRoundIndex(game)
  const voteRoundIndex = getResVoteRoundIndex(game)
  const playerIndex = getPlayerIndex(game, userID)
  // Set only the player's vote using MongoDB's dot notation to prevent
  // players from overwriting each other during concurrent votes
  return {
    $set: {
      [`rounds.${roundIndex}.votes.${voteRoundIndex}.${playerIndex}`]: vote,
    },
  } as UpdateFilter<ResGame>
}

export function revealResVote(
  game: ResGame
): UpdateFilter<ResGame> | undefined {
  if (
    game.phase === 'guess' &&
    game.step === 'team_vote' &&
    isResVoteComplete(game)
  ) {
    if (isResVoteRejected(game)) {
      const voteRoundIndex = getResVoteRoundIndex(game)
      if (voteRoundIndex + 1 === 5) {
        // Spies win if 5 voting rounds are rejected in a single mission
        return {
          $set: {
            phase: 'win',
            step: 'team_vote_reveal',
          },
        } as UpdateFilter<ResGame>
      }

      // Round Mission Lead changes on Mission Team vote rejection
      const roundIndex = getResRoundIndex(game)
      const roundLeadPath = `rounds.${roundIndex}.lead`
      const leadIndex = getNextResLeadIndex(game)
      return {
        $set: {
          step: 'team_vote_reveal',
          [roundLeadPath]: leadIndex,
        },
      } as UpdateFilter<ResGame>
    }
    return {
      $set: {
        step: 'team_vote_reveal',
      },
    }
  }
}
