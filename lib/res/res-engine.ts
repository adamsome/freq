import { UpdateFilter } from 'mongodb'
import invariant from 'tiny-invariant'
import { Player } from '../types/game.types'
import {
  ResGame,
  ResGameView,
  ResRound,
  ResMissionStatus,
  ResVoteStatus,
  ResPlayerProps,
  ResStepSection,
} from '../types/res.types'
import { User } from '../types/user.types'
import { partition, range } from '../util/array'
import { shuffle } from '../util/random'
import { RES_CARDS } from './res-card-def'

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
    `No valid Spy count for player count '${playerCount}'`
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
  missionIndex: number
): number {
  const sizePerMission = RES_TEAM_SIZE[playerCount]
  invariant(
    sizePerMission != null,
    `No Mission Team size for player count '${playerCount}'`
  )
  const size = sizePerMission[missionIndex]
  invariant(
    size != null,
    `No Mission Team size for Mission index '${missionIndex}'`
  )
  return size
}

// Rounds

export function getResMissionIndex(game: ResGame): number {
  const missionCount = game.missions.length
  invariant(missionCount > 0, 'Match requires at least one Mission')
  return game.missions.length - 1
}

export function getResRoundIndex(game: ResGame): number {
  const missionIndex = getResMissionIndex(game)
  const mission = game.missions[missionIndex]
  invariant(mission.length > 0, 'Match requires at least one round')
  return mission.length - 1
}

export function getResRound(game: ResGame): ResRound {
  const missionIndex = getResMissionIndex(game)
  const mission = game.missions[missionIndex]
  const roundIndex = getResRoundIndex(game)
  return mission[roundIndex]
}

// Players

function getPlayerCount(game: ResGame): number {
  return game.players.length
}

export function getResPlayerIndex(
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

export function getPlayerCardSrc(
  game: ResGame,
  userOrID: string | Player | User
): string | undefined {
  const playerIndex = getResPlayerIndex(game, userOrID)
  const cardIndex = game.cards?.[playerIndex]
  if (cardIndex != null) {
    return `/res/${RES_CARDS[cardIndex]}.jpg`
  }
}

export function getResLead(game: ResGame): Player {
  const round = getResRound(game)
  const lead = game.players[round.lead]
  invariant(lead, 'Mission Lead not in the match')
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
  game: ResGame,
  userOrID?: string | Player | User
): boolean {
  if (userOrID == null) {
    return false
  }
  const userID = typeof userOrID === 'string' ? userOrID : userOrID.id
  return game.spies.map((i) => game.players[i]).some((p) => p.id === userID)
}

export function shouldRevealResSpies(game: ResGameView): boolean {
  return (
    game.phase === 'guess' &&
    game.step === 'spy_reveal' &&
    isResSpy(game, game.currentPlayer)
  )
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

export function getNextResLead(game: ResGame): Player {
  const nextLeadIndex = getNextResLeadIndex(game)
  const player = game.players[nextLeadIndex]
  invariant(player, 'Next Lead is not in match')
  return player
}

export function isResPlayerActive(
  game: ResGame,
  userOrID?: string | Player | User
): boolean {
  if (game.phase !== 'guess') {
    return false
  }
  switch (game.step) {
    case 'spy_reveal':
    case 'team_vote_reveal':
    case 'mission_reveal':
      return false
    case 'team_select':
      return isResLead(game, userOrID)
    case 'team_vote':
      return getResPlayerVoteStatus(game, userOrID) === 'notVoted'
    case 'mission':
      return (
        isResTeamMember(game, userOrID) &&
        getResPlayerMissionResult(game, userOrID) === null
      )
  }
}

function getResStepSection(game: ResGame): ResStepSection {
  switch (game.phase) {
    case 'prep':
      return 'prep'
    case 'guess': {
      switch (game.step) {
        case 'spy_reveal':
          return 'spy'
        case 'team_select':
          return 'select'
        case 'team_vote':
        case 'team_vote_reveal':
          return 'vote'
        case 'mission':
        case 'mission_reveal':
          return 'mission'
      }
    }
    case 'win':
      return 'win'
  }
}

export function getResPlayerProps(
  game: ResGame,
  player: Player
): ResPlayerProps {
  const playerIndex = getResPlayerIndex(game, player)
  const orderIndex = game.player_order.findIndex((i) => i === playerIndex)
  invariant(orderIndex >= 0, 'Player not found in player order')
  const spy = isResSpy(game, player)
  const isTeamRequiredSize = isResTeamRequiredSize(game)
  const selected = isResTeamMember(game, player)
  const missionIndex = getResMissionIndex(game)
  const missionStatus = getResMissionStatus(game, missionIndex)
  const props: ResPlayerProps = {
    section: getResStepSection(game),
    orderIndex,
    name: player.name ?? 'Unnamed',
    you: player.id === game.currentPlayer?.id,
    lead: isResLead(game, player),
    spy,
    active: isResPlayerActive(game, player),
    selected,
    selectable:
      game.step === 'team_select' && (selected || !isTeamRequiredSize),
    benched: !selected && isTeamRequiredSize,
    missionNumber: selected ? missionIndex + 1 : undefined,
    missionFailure: missionStatus === 'failure',
    voteStatus: getResPlayerVoteStatus(game, player),
    cardSrc: getPlayerCardSrc(game, player),
  }
  if (game.phase === 'win') {
    props.winner = spy
      ? missionStatus === 'failure'
      : missionStatus === 'success'
  }
  return props
}

// Team

function getResTeamMemberIndices(game: ResGame): number[] {
  const round = getResRound(game)
  return round.team
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
    'Mission Team Member not in match'
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
  userOrID?: string | Player | User
): boolean {
  if (!userOrID || game.phase !== 'guess' || game.step === 'spy_reveal') {
    return false
  }
  const teamMemberIndex = findTeamMemberIndex(game, userOrID)
  return teamMemberIndex >= 0
}

export function isResTeamRequiredSize(game: ResGame): boolean {
  if (game.phase !== 'guess' || game.step === 'spy_reveal') {
    return false
  }
  const playerCount = getPlayerCount(game)
  const missionIndex = getResMissionIndex(game)
  const teamSizeRequired = getResTeamSizeRequired(playerCount, missionIndex)
  const teamSize = getResTeamSize(game)
  return teamSize === teamSizeRequired
}

// Votes

export function getResVotes(game: ResGame): (boolean | null)[] {
  if (game.phase !== 'guess') {
    return []
  }
  const round = getResRound(game)
  return round.votes
}

export function getResRejectedVoteRounds(
  game: ResGame,
  missionIndex: number
): number {
  const mission = game.missions[missionIndex]
  if (mission && mission.length > 0) {
    return mission.length - 1
  }
  return 0
}

export function getResCastVotes(game: ResGame): boolean[] {
  const votes = getResVotes(game)
  return votes.filter((v) => v !== null) as boolean[]
}

export function isResVoteComplete(game: ResGame): boolean {
  const playerCount = getPlayerCount(game)
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
  const playerIndex = getResPlayerIndex(game, userOrID)
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

// Results

export function getResMissionResults(
  game: ResGame
): (boolean | null)[] | undefined {
  if (game.phase === 'prep') {
    return []
  }
  const round = getResRound(game)
  return round.result
}

export function getResCastMissionResults(game: ResGame): boolean[] {
  const results = getResMissionResults(game) ?? []
  return results.filter((v) => v !== null) as boolean[]
}

export function getResPlayerMissionResult(
  game: ResGame,
  userOrID?: string | Player | User
): boolean | null {
  if (userOrID == null || game.step !== 'mission') {
    return null
  }
  const playerIndex = getResPlayerIndex(game, userOrID)
  const teamIndices = getResTeamMemberIndices(game)
  const teamIndex = teamIndices.findIndex((i) => i === playerIndex)
  if (teamIndex >= 0) {
    const results = getResMissionResults(game)
    const playerVote = results?.[teamIndex]
    invariant(playerVote !== undefined, 'Player Mission result invalid')
    return playerVote
  }
  return null
}

export function isResMissionResultComplete(game: ResGame): boolean {
  const playerCount = getPlayerCount(game)
  const missionIndex = getResMissionIndex(game)
  const teamSize = getResTeamSizeRequired(playerCount, missionIndex)
  const caseMissionResults = getResCastMissionResults(game)
  return caseMissionResults.length === teamSize
}

export function getResMissionSabotageCount(game: ResGame): number {
  const castResults = getResCastMissionResults(game)
  const sabotages = castResults.filter((r) => r === false)
  return sabotages.length
}

export function isResMissionSuccessful(game: ResGame): boolean {
  if (!isResMissionResultComplete(game)) {
    return false
  }
  const sabotageCount = getResMissionSabotageCount(game)
  return sabotageCount === 0
}

export function isResMissionFailed(game: ResGame): boolean {
  if (!isResMissionResultComplete(game)) {
    return false
  }
  const sabotageCount = getResMissionSabotageCount(game)
  return sabotageCount > 0
}

export function getResMissionStatus(
  game: ResGame,
  missionIndex?: number
): ResMissionStatus {
  missionIndex = missionIndex ?? getResMissionIndex(game)
  const mission = game.missions[missionIndex]
  const round = mission?.[mission.length - 1]
  if (game.phase === 'prep' || !mission || !round) {
    return 'unplayed'
  }
  const playerCount = getPlayerCount(game)
  const teamSize = getResTeamSizeRequired(playerCount, missionIndex)
  if (round.result) {
    const results = round.result.filter((res) => res !== null)
    invariant(
      results.length <= teamSize,
      'Round result count cannot be greater than Mission Team size'
    )
    if (results.length === teamSize) {
      return results.every((r) => r === true) ? 'success' : 'failure'
    }
  }
  return 'current'
}

export function getAllResMissionResults(game: ResGame): ResMissionStatus[] {
  return range(5).map((i) => getResMissionStatus(game, i))
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
  const playerCount = getPlayerCount(game)
  const count = getResSpyCountRequired(playerCount)
  const playerIndices = game.players.map((_, i) => i)
  const shuffledPlayerIndices = shuffle(playerIndices)
  return shuffledPlayerIndices.slice(0, count)
}

export function generateResCards(game: ResGame): number[] {
  const playerCount = getPlayerCount(game)
  const shuffledCardIndices = shuffle(range(RES_CARDS.length))
  return shuffledCardIndices.slice(0, playerCount)
}

export function startResTeamSelect(
  game: ResGame,
  userID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' &&
      (game.step === 'spy_reveal' ||
        (game.step === 'team_vote_reveal' && isResVoteRejected(game)) ||
        game.step === 'mission_reveal'),
    'Can only start Mission Team select from this step'
  )
  if (game.step === 'spy_reveal') {
    invariant(
      isResLead(game, userID),
      `Lead must start Mission Team vote. Player '${userID}' is not Lead.`
    )
  } else {
    const nextLead = getNextResLead(game)
    invariant(
      nextLead?.id === userID,
      `Next Lead must start Mission Team vote. Player '${userID}' is not Lead.`
    )
  }

  switch (game.step) {
    case 'spy_reveal': {
      // Spy Reveal step only occurs at start of match where the first
      // Mission Round has already been created
      return {
        $set: {
          step: 'team_select',
        },
      }
    }
    case 'team_vote_reveal': {
      const missionIndex = getResMissionIndex(game)
      const nextLead = getNextResLeadIndex(game)
      const playerCount = getPlayerCount(game)
      const newVotes = range(playerCount).map(() => null)
      const newRound: ResRound = { lead: nextLead, team: [], votes: newVotes }

      return {
        $set: {
          step: 'team_select',
        },
        $push: {
          [`missions.${missionIndex}`]: newRound,
        },
      }
    }
    case 'mission_reveal': {
      const nextLead = getNextResLeadIndex(game)
      const playerCount = getPlayerCount(game)
      const newVotes = range(playerCount).map(() => null)
      const newRound: ResRound = { lead: nextLead, team: [], votes: newVotes }

      return {
        $set: {
          step: 'team_select',
        },
        $push: {
          missions: [newRound],
        },
      }
    }
  }
}

export function selectResTeamMember(
  game: ResGame,
  userID: string,
  teamMemberID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' && game.step === 'team_select',
    'Can only select Mission Team member in Mission Team select step'
  )
  invariant(
    isResLead(game, userID),
    `Only Lead can select Mission Team Member. Player '${userID}' is not Lead.`
  )
  const isTeamMember = isResTeamMember(game, teamMemberID)
  invariant(
    isTeamMember ? true : !isResTeamRequiredSize(game),
    'Mission Team is already at required size'
  )

  const missionIndex = getResMissionIndex(game)
  const roundIndex = getResRoundIndex(game)
  const playerIndex = getResPlayerIndex(game, teamMemberID)
  return {
    [isTeamMember ? '$pull' : '$push']: {
      [`missions.${missionIndex}.${roundIndex}.team`]: playerIndex,
    },
  }
}

export function startResTeamVote(
  game: ResGame,
  userID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' && game.step === 'team_select',
    'Can only start Mission Team vote from the Mission Team select step'
  )
  invariant(
    isResLead(game, userID),
    `Lead must start Mission Team vote. Player '${userID}' is not Lead.`
  )
  invariant(
    isResTeamRequiredSize(game),
    'Selected Mission Team size not ready for vote'
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
    'Can only vote in the Mission Team vote step'
  )

  const alreadyVoted = getResPlayerVote(game, userID) !== null
  if (alreadyVoted) {
    return
  }

  const missionIndex = getResMissionIndex(game)
  const roundIndex = getResRoundIndex(game)
  const playerIndex = getResPlayerIndex(game, userID)
  return {
    $set: {
      [`missions.${missionIndex}.${roundIndex}.votes.${playerIndex}`]: vote,
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
      const roundIndex = getResRoundIndex(game)
      if (roundIndex + 1 === 5) {
        // Spies win if 5 voting rounds are rejected in a single mission
        return {
          $set: {
            phase: 'win',
            step: 'team_vote_reveal',
          },
        } as UpdateFilter<ResGame>
      }
    }

    return {
      $set: {
        step: 'team_vote_reveal',
      },
    }
  }
}

export function startResMission(
  game: ResGame,
  userID: string
): UpdateFilter<ResGame> {
  invariant(
    game.phase === 'guess' && game.step === 'team_vote_reveal',
    'Can only start Mission from the Mission Team vote reveal step'
  )
  invariant(
    isResLead(game, userID),
    `Lead must start Mission. Player '${userID}' is not Lead.`
  )
  invariant(
    isResTeamRequiredSize(game),
    'Mission Team size not ready for Mission'
  )
  const playerCount = getPlayerCount(game)
  const missionIndex = getResMissionIndex(game)
  const roundIndex = getResRoundIndex(game)
  const teamSize = getResTeamSizeRequired(playerCount, missionIndex)
  const newResult = range(teamSize).map(() => null)
  return {
    $set: {
      step: 'mission',
      [`missions.${missionIndex}.${roundIndex}.result`]: newResult,
    },
  } as UpdateFilter<ResGame>
}

export function supportResMission(
  game: ResGame,
  userID: string,
  doesSupport: boolean
): UpdateFilter<ResGame> | undefined {
  invariant(
    game.phase === 'guess' && game.step === 'mission',
    'Can only Support in the Mission step'
  )
  const playerCount = getPlayerCount(game)
  const missionIndex = getResMissionIndex(game)
  const teamMemberIndex = findTeamMemberIndex(game, userID)
  const teamSize = getResTeamSizeRequired(playerCount, missionIndex)
  invariant(
    teamMemberIndex >= 0 && teamMemberIndex < teamSize,
    'Only Mission Team Members can Support the Mission'
  )

  const alreadySupported = getResPlayerMissionResult(game, userID) !== null
  if (alreadySupported) {
    return
  }

  const roundIndex = getResRoundIndex(game)
  return {
    $set: {
      [`missions.${missionIndex}.${roundIndex}.result.${teamMemberIndex}`]:
        doesSupport,
    },
  } as UpdateFilter<ResGame>
}

export function revealResMission(
  game: ResGame
): UpdateFilter<ResGame> | undefined {
  if (
    game.phase === 'guess' &&
    game.step === 'mission' &&
    isResMissionResultComplete(game)
  ) {
    const statuses = getAllResMissionResults(game)
    const successCount = statuses.filter((s) => s === 'success').length
    const failureCount = statuses.filter((s) => s === 'failure').length
    if (successCount === 3 || failureCount === 3) {
      return {
        $set: {
          phase: 'win',
          step: 'mission_reveal',
        },
      }
    }

    return {
      $set: {
        step: 'mission_reveal',
      },
    }
  }
}
