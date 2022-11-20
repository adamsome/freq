import { BaseGame, Command, GameType, Header, PlayerView } from './game.types'

/**
 ```md
Game Play
=========

Prep
----

- Players join the game room.
- Shuffle action shuffles the player order and randomly assign a Mission Lead.
- Once between 5 and 10 players are in the room, Mission Lead can begin match.

Guess (Main Game Phase)
-----------------------

### Spies Reveal

- Players are assigned as either a Resistance member or a Spy.
  Spies are able to see who all other Spies are, whereas Resistance members
  are in the dark. Number of Spies assigned is based on total number of players:

  | Players | 5 | 6 | 7 | 8 | 9 | 10 |
  | ------- | - | - | - | - | - | -- |
  | Spies   | 2 | 2 | 3 | 3 | 3 | 4  |

### Game Play

- Once players have had the chance to see whether or not they are a Spy (and
  who the other Spies are if they are a Spy), up to 5 rounds of gameplay
  commence. Each round consists of a "Build the Team" (Mission Team Approval)
  phase and a "Conduct the Mission" phase.

#### Build the Team

##### Mission Team Assignment

- Mission Lead discusses with players and proposes which players they would like
  to send on the Mission (can send themself). Number of Mission Team Members is
  based on the total number of players:

  | Players | 5 | 6 | 7 | 8 | 9 | 10 |
  | ------- | - | - | - | - | - | -- |
  | Round 1 | 2 | 2 | 2 | 3 | 3 | 3  |
  | Round 2 | 3 | 3 | 3 | 4 | 4 | 4  |
  | Round 3 | 2 | 4 | 3 | 4 | 4 | 4  |
  | Round 4 | 3 | 3 | 4 | 5 | 5 | 5  |
  | Round 5 | 3 | 4 | 4 | 5 | 5 | 5  |

- After discussion, lead can commence the next phase, Mission Team Vote.

##### Mission Team Vote

- All players (including Lead) secretly vote Approve or Reject on the
  composition of the Lead's selected Mission Team.
- Once all players have voted, the votes are revealed.
- If over 50% Approve, move to Conduct the Mission phase.
- Otherwise, the Lead gets passed to the next player in player order and the
  Build the Team phase restart.
- If 5 Mission Teams are Rejected in the same round, the Spies immediately
  win the match.

#### Conduct the Mission

- Each Mission Team Member secretly decides to either Support or Sabotage the
  Mission.
- Non-Spies can only decide to Support the Mission.
- Member decisions are shuffled so no one knows who decided what.
- Mission Succeeds only if all Members Support the Mission.
- Exception: In matches with 7 or more players, on the 4th Mission, two
  Sabotage decisions are required to Fail the Mission.
- After Mission Success or Failure, Lead is passed to next player in player
  order, the round counter is incremented, and play restarts at the
  Build the Team phase.

Win
---

- Match ends immediatly after three successful or three Failed Missions, or
  if a Mission Team vote is not Approved after 5 rounds of voting.

 ```
 */

export const RES_PHASES = ['prep', 'guess', 'win'] as const
export type ResPhase = typeof RES_PHASES[number]

export const RES_STEPS = [
  'spy_reveal',
  'team_select',
  'team_vote',
  'team_vote_reveal',
  'mission',
  'mission_reveal',
] as const
export type ResStep = typeof RES_STEPS[number]

export const RES_ACTIONS_ID = [
  'start_team_select',
  'select_team_player',
  'start_team_vote',
  'vote_team',
  'reveal_vote',
  'start_mission',
  'support_mission',
  'reveal_mission',
] as const
export type ResActionID = typeof RES_ACTIONS_ID[number]

export type ResStepSection =
  | 'prep'
  | 'spy'
  | 'select'
  | 'vote'
  | 'mission'
  | 'win'

export type ResMissionStatus = 'success' | 'failure' | 'current' | 'unplayed'
export type ResVoteStatus = 'approve' | 'reject' | 'voted' | 'notVoted'

export interface ResAction {
  type: ResActionID
  payload?: unknown
}

export type ResPlayerView = PlayerView

export interface ResRound {
  /** Player index of Mission Lead. */
  lead: number
  /** List of player indices proposed by the Lead to be on the Mission Team. */
  team: number[]
  /**
   * The vote to Approve the Mission Team per player index.
   * Over 50% of players must Approve for the Mission Team to be approved.
   * If no approval after 5 voting rounds, the Spies win the game.
   *
   * - `true`: Approve
   * - `false`: Reject
   * - `null`: Not yet voted
   **/
  votes: (boolean | null)[]
  /**
   * Mission result: each player on Mission Team can Support or Sabotage
   * the Mission. All Mission Team players must Support for mission to succeed.
   *
   * - `true`: Support
   * - `false`: Sabotage
   */
  result?: (boolean | null)[]
}

export type ResGame = BaseGame & {
  currentPlayer?: ResPlayerView
  /**
   * High-level phase of the game:
   * - `prep`: Prior to match start; players are still joining the game.
   * - `guess`: Actual game play, Mission Team voting, Missions, etc.
   * - `win`: Once the Resistance or Spies have won the game.
   **/
  phase: ResPhase
  /** Current step (sub-phase) in the round. */
  step: ResStep
  /**
   * Player order by index is set at beginning of the match.
   * Mission Lead player is passed to the next player in order after each
   * Mission or Rejected Mission Team vote round.
   **/
  player_order: number[]
  /** By player index, the card index assigned. */
  cards?: number[]
  /**
   * List of player indices determining which players are Spies (as opposed
   * to Resistance members). Set at the beginning of the match.
   * When game state send to client, only if the client player's index is
   * included in the array is the list of Spies send, to avoid being
   * able to see who else are Spies for non-Spies.
   **/
  spies: number[]
  /**
   * Match consists of 5 rounds (Mission Team Approval + Mission result).
   * Match is won by the Resistance once a majority of round Missions are passed
   * and by the Spies if a majority of round Missions are Failed.
   */
  missions: ResRound[][]
}

export type ResGameView = ResGame & {
  type: GameType
  commands: Command[]
  headers?: Header[]
}

export interface ResPlayerProps {
  section: ResStepSection
  orderIndex: number
  name: string
  you: boolean
  lead: boolean
  spy: boolean
  active: boolean
  selected: boolean
  selectable: boolean
  benched: boolean
  missionNumber?: number
  missionFailure?: boolean
  voteStatus?: ResVoteStatus
  cardSrc?: string
  winner?: boolean
}
