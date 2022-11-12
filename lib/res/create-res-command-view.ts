import invariant from 'tiny-invariant'
import { doesGameHaveEnoughPlayers } from '../game'
import { Command, CommandsView, Header, Player } from '../types/game.types'
import { ResAction, ResActionID, ResGame } from '../types/res.types'
import { toNumberWord } from '../util/number'
import { randomHourlyItem } from '../util/random'
import {
  getAllResMissionResults,
  getNextResLead,
  getResCastMissionResults,
  getResCastVotes,
  getResLead,
  getResMissionIndex,
  getResMissionSabotageCount,
  getResMissionStatus,
  getResPlayerMissionResult,
  getResPlayerVote,
  getResRoundIndex,
  getResSpyCountRequired,
  getResTeamSize,
  getResTeamSizeRequired,
  getResVotesApprovedAndRejected,
  isResLead,
  isResMissionResultComplete,
  isResSpy,
  isResTeamMember,
  isResTeamRequiredSize,
  isResVoteComplete,
} from './res-engine'

const COLOR_GRAY = 'Gray'
const COLOR_BLUE = 'Cerulean'
const COLOR_GREEN = 'Phosphorus'
const COLOR_RED = 'Scarlet'

export default function createResCommandView(
  game: ResGame,
  player?: Player
): CommandsView {
  const header: Header = { text: '', color: player?.color }
  const cmd: Command = { text: '', color: COLOR_BLUE }
  const view: CommandsView = { headers: [header], commands: [cmd] }

  const playerCount = game.players.length

  switch (game.phase) {
    case 'prep': {
      header.text = 'Welcome to the Underground, comrade!'
      header.colorLit = 0.25

      if (!player) return view

      const shuffleCmd: Command = {
        text: 'Shuffle Teams',
        type: 'shuffle_teams',
        color: COLOR_GRAY,
      }

      const enoughPlayers = doesGameHaveEnoughPlayers(game, 'res')
      if (enoughPlayers) {
        cmd.type = 'begin_round'
        cmd.text = "Let's Go!"
        shuffleCmd.info = 'Start once all Partisans have joined.'
      } else {
        cmd.text = 'Waiting for Partisans...'
        cmd.disabled = true
        shuffleCmd.info =
          'You can begin once the Underground has at least 5 Partisans.'
      }

      if (playerCount > 12) {
        cmd.info = shuffleCmd.info
        return view
      }

      view.commands = [cmd, shuffleCmd]
      return view
    }
    case 'guess': {
      const lead = getResLead(game)
      const roundIndex = getResMissionIndex(game)

      switch (game.step) {
        case 'spy_reveal': {
          const spyCount = getResSpyCountRequired(playerCount)
          const spyCountWord = toNumberWord(spyCount)
          header.text =
            `The Underground is rising. ` +
            `Successfully complete three Missions to achieve Victory ` +
            `for the cause! But be warned: Intelligence has comfirmed that ` +
            `${spyCountWord} Enemy Agents have infiltrated. If they ` +
            `Sabotage three Missions, the Underground will be destroyed!`
          // TODO: Add copy indicating that only spies know the identity
          // of other spies

          const action: ResAction = { type: 'start_team_select' }
          cmd.type = 'action'
          cmd.value = action
          cmd.text = 'Build Mission Team'
          cmd.info =
            `${lead.name} is the current Mission Commander. They will build ` +
            `the first Mission Team once everyone's ready.`
          cmd.disabled = true

          if (isResLead(game, player)) {
            cmd.info =
              `You are the current Mission Commander. Once everyone ` +
              `is ready, continue to build the first Mission Team.`
            cmd.disabled = false
          }

          return view
        }
        case 'team_select': {
          header.text =
            `The Mission Commander is putting together a Team to go on ` +
            `Mission ${roundIndex + 1}. Once proposed, all Partisans will ` +
            `Vote to Approve or Reject the Mission Team. `

          const size = getResTeamSize(game)
          const sizeRequired = getResTeamSizeRequired(playerCount, roundIndex)
          const sizeRequiredWord = toNumberWord(sizeRequired)
          const action: ResAction = { type: 'start_team_vote' }
          cmd.type = 'action'
          cmd.value = action
          cmd.text = `Propose Mission Team`
          cmd.info =
            `${lead.name} is selecting ${sizeRequiredWord} comrades ` +
            `for the Mission Team. (${size} of ${sizeRequired} needed)`
          cmd.disabled = true

          if (isResLead(game, player)) {
            header.text =
              `You are the Mission Commander. Propose a Team to go on ` +
              `Mission ${roundIndex + 1}. Once submitted, all Partisans will ` +
              `Vote to Approve or Reject the Mission Team. `

            cmd.info =
              `Select ${sizeRequiredWord} comrades for the Mission Team. ` +
              `(${size} of ${sizeRequired} needed)`
            cmd.disabled = !isResTeamRequiredSize(game)
          }

          return view
        }
        case 'team_vote': {
          const castVotes = getResCastVotes(game)
          const roundIndex = getResRoundIndex(game)
          const voteRoundsRemaining = 5 - roundIndex
          let remainingText = ''
          if (voteRoundsRemaining < 5) {
            const voteRoundsRemainingWord = toNumberWord(voteRoundsRemaining)
            const proposalWord =
              voteRoundsRemaining === 1
                ? 'proposal remains'
                : 'proposals remain'
            remainingText = ` Only ${voteRoundsRemainingWord} Team ${proposalWord}!`
          }
          header.text =
            `All Partisans must vote to Approve or Reject the Mission ` +
            `Commander's proposed Team. The Underground has five chances to ` +
            `Approve a Team for this Mission or else the Enemy wins.` +
            remainingText

          if (isResVoteComplete(game)) {
            const action: ResAction = { type: 'reveal_vote' }
            cmd.type = 'action'
            cmd.value = action
            cmd.text = `Reveal Votes`
            cmd.info = `Tallying votes (${castVotes.length} of ${playerCount} cast)`
            cmd.color = COLOR_GRAY
            return view
          }

          const vote = getResPlayerVote(game, player)
          const tally = `(${castVotes.length} of ${playerCount} cast)`
          const actionApprove: ResAction = { type: 'vote_team', payload: true }
          const actionReject: ResAction = { type: 'vote_team', payload: false }
          cmd.type = 'action'
          cmd.value = actionReject
          cmd.text = `Reject`
          cmd.info = `Tallying votes. ${tally}`
          cmd.color = COLOR_RED
          cmd.disabled = vote !== null

          cmd.rightType = 'action'
          cmd.rightValue = actionApprove
          cmd.rightText = 'Approve'
          cmd.rightColor = COLOR_GREEN
          cmd.rightDisabled = vote !== null

          return view
        }
        case 'team_vote_reveal': {
          const [approved, rejected] = getResVotesApprovedAndRejected(game)
          const voteSucceeded = approved > rejected
          if (voteSucceeded) {
            const approvedWord = toNumberWord(approved)
            const rejectedWord = toNumberWord(rejected)
            const resultText = `with ${approvedWord} votes for, ${rejectedWord} against.`
            header.text = `Mission Team is Approved ${resultText}`

            const action: ResAction = { type: 'start_mission' }
            cmd.type = 'action'
            cmd.value = action
            cmd.text = `Start Mission!`
            cmd.info = `${lead.name} will start the Mission once everyone's ready.`
            cmd.disabled = true

            if (isResLead(game, player)) {
              cmd.info = `Continue once everyone is ready.`
              cmd.disabled = false
            }
          } else {
            header.text =
              `Mission Team was Rejected! Mission Command will pass to the ` +
              `next Partisan in order to propose the next Mission Team.`

            const nextLead = getNextResLead(game)

            const action: ResAction = { type: 'start_team_select' }
            cmd.type = 'action'
            cmd.value = action
            cmd.text = `Build Mission Team`
            cmd.info =
              `${nextLead.name} is now the new Mission Commander. They will ` +
              `propose the next Mission Team once everyone's ready.`
            cmd.disabled = true

            if (player?.id === nextLead.id) {
              cmd.info =
                `You are now the new Mission Commander. Once everyone ` +
                `is ready, continue to propose the next Mission Team.`
              cmd.disabled = false
            }
          }

          return view
        }
        case 'mission': {
          header.text =
            `Mission is in progress. True Partisans will Support the ` +
            `Mission. But, Beware! Enemy Agents on the Mission Team have the ` +
            `option to Sabotage causing the Mission to Fail.`

          if (isResMissionResultComplete(game)) {
            const action: ResAction = { type: 'reveal_mission' }
            cmd.type = 'action'
            cmd.value = action
            cmd.text = `Reveal Mission Result`
            cmd.info = `Mission is complete; continue to reveal the result.`
            cmd.color = COLOR_GRAY
            return view
          }

          const isSpectator = !isResTeamMember(game, player)
          const isSpy = isResSpy(game, player)
          const acted = getResPlayerMissionResult(game, player) != null

          const type: ResActionID = 'support_mission'
          const actionSupport: ResAction = { type, payload: true }
          const actionSabotage: ResAction = { type, payload: false }
          cmd.type = 'action'
          cmd.value = actionSabotage
          cmd.text = `Sabotage`
          cmd.color = COLOR_RED
          cmd.disabled = acted || isSpectator || !isSpy

          cmd.rightType = 'action'
          cmd.rightValue = actionSupport
          cmd.rightText = 'Support'
          cmd.rightColor = COLOR_GREEN
          cmd.rightDisabled = acted || isSpectator

          const teamSize = getResTeamSize(game)
          const castMissionResults = getResCastMissionResults(game)
          const tally = `(${castMissionResults.length} of ${teamSize} acted)`
          if (isSpectator) {
            const playerIndex =
              game.players.findIndex((p) => p.id === player?.id) ?? 0
            const editorial = isSpy
              ? ` (${randomHourlyItem(spyEditorials, playerIndex)})`
              : ''
            cmd.info =
              `Eagerly waiting for the Mission Team's ` +
              `success${editorial}. ${tally}`
          } else if (isSpy) {
            cmd.info =
              `As an Enemy Agent, you have the option to Sabotage the ` +
              `Mission. This action is secret but could still rouse ` +
              `suspicion! ${tally}`
          } else {
            cmd.info = `As a true Partisan, you must Support the Mission!. ${tally}`
          }

          return view
        }
        case 'mission_reveal': {
          const status = getResMissionStatus(game)
          const allStatuses = getAllResMissionResults(game)
          invariant(
            status === 'success' || status === 'failure',
            'Mission must be complete during reveal'
          )
          if (status === 'success') {
            const successCount = allStatuses.filter(
              (s) => s === 'success'
            ).length
            const remaining = 3 - successCount
            const remainingWord = toNumberWord(remaining)
            let missionWord = 'Mission'
            if (remaining !== 1) missionWord += 's'
            header.text =
              `The Mission was successfull! The Underground needs to ` +
              `successfully complete just ${remainingWord} more ` +
              `${missionWord} to defeat the Enemy. Mission Command will pass ` +
              `to the next Partisan in order to propose the next Mission Team.`
          } else {
            const sabotageCount = getResMissionSabotageCount(game)
            const sabotageCountWord = toNumberWord(sabotageCount)
            const failureCount = allStatuses.filter(
              (s) => s === 'failure'
            ).length
            const remaining = 3 - failureCount
            const remainingWord = toNumberWord(remaining)
            let missionWord = 'Mission'
            if (remaining !== 1) missionWord += 's'
            header.text =
              `Sabotage by ${sabotageCountWord} of the Mission Team members! ` +
              `The Enemy needs to Sabotage just ${remainingWord} more ` +
              `${missionWord} to destroy the Underground. Mission Command ` +
              `will pass to the next Partisan in order to propose the next ` +
              `Mission Team.`
          }

          const nextLead = getNextResLead(game)

          const action: ResAction = { type: 'start_team_select' }
          cmd.type = 'action'
          cmd.value = action
          cmd.text = `Build Mission Team`
          cmd.info =
            `${nextLead.name} is the new Mission Commander. They will ` +
            `propose the next Mission Team once everyone's ready.`
          cmd.disabled = true

          if (player?.id === nextLead.id) {
            cmd.info =
              `You are now the new Mission Commander. Once everyone ` +
              `is ready, continue to propose the next Mission Team.`
            cmd.disabled = false
          }

          return view
        }
      }
      return view
    }
    case 'win': {
      if (game.step === 'team_vote_reveal') {
        header.text =
          `The Enemy has won! Enemy Agents were able to sow discord amongst ` +
          `the Partisans, immobilizing and preventing them from putting ` +
          `together a Mission Team. The Underground disbanded and has been ` +
          `relegated to the dust bin of history.`
      } else {
        const status = getResMissionStatus(game)
        if (status === 'success') {
          header.text =
            `The Underground has won! The Mission was a resounding success ` +
            `causing irreparable damage to the Enemy and giving the ` +
            `Partisans the upper hand. Long live the revolution!`
        } else {
          const sabotageCount = getResMissionSabotageCount(game)
          const sabotageCountWord = toNumberWord(sabotageCount)
          header.text =
            `The Enemy has won! Total sabotage by ${sabotageCountWord} of ` +
            `the Mission Team members! The Underground has been completely ` +
            `discredited and its Partisans are being hunted down.`
        }
      }

      if (!player) return view

      cmd.type = 'prep_new_match'
      cmd.text = "Let's Go Again!"
      return view
    }
    default:
      return view
  }
}

const spyEditorials = [
  'lol',
  'or so you told everyone',
  ':wink:',
  'you say aloud',
]
