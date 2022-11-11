import { doesGameHaveEnoughPlayers } from '../game'
import { Command, CommandsView, Header, Player } from '../types/game.types'
import { ResAction, ResGame } from '../types/res.types'
import { toNumberWord } from '../util/number'
import {
  getResCastVotes,
  getResLead,
  getResPlayerVote,
  getResRoundIndex,
  getResSpyCountRequired,
  getResTeamSize,
  getResTeamSizeRequired,
  getResVotesAndIndex,
  getResVotesApprovedAndRejected,
  isResLead,
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
      const roundIndex = getResRoundIndex(game)

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
          const [, voteRoundIndex] = getResVotesAndIndex(game)
          const castVotes = getResCastVotes(game)
          const voteRoundsRemaining = 5 - voteRoundIndex
          let remainingText = ''
          if (voteRoundsRemaining < 5) {
            const voteRoundsRemainingWord = toNumberWord(voteRoundsRemaining)
            remainingText =
              ` Only ${voteRoundsRemainingWord} Team ` + `proposals remain!`
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
          const actionApprove: ResAction = { type: 'vote_team', payload: true }
          const actionReject: ResAction = { type: 'vote_team', payload: false }
          cmd.type = 'action'
          cmd.value = actionReject
          cmd.text = `Reject`
          cmd.info = `Tallying votes (${castVotes.length} of ${playerCount} cast)`
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

            const action: ResAction = { type: 'start_team_select' }
            cmd.type = 'action'
            cmd.value = action
            cmd.text = `Build Mission Team`
            cmd.info =
              `${lead.name} is now the new Mission Commander. They will ` +
              `propose the next Mission Team once everyone's ready.`
            cmd.disabled = true

            if (isResLead(game, player)) {
              cmd.info =
                `You are now the new Mission Commander. Once everyone ` +
                `is ready, continue to propose the next Mission Team.`
              cmd.disabled = false
            }
          }

          return view
        }
      }
      return view
    }
    case 'win': {
      header.text = `Win!`
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
