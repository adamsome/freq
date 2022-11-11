import { BaseGame, Command, GameType, PlayerView } from './game.types'

/**
 ```md
Game Play
=========

Prep
----

- Players join the game room.
- Shuffle action shuffles the player order and randomly assign a team lead.
- Once between 5 and 10 players are in the room, team lead can begin match.

Guess (Main Game Phase)
-----------------------

### Spies Reveal

- Players are assigned as either a resistance member or a spy.
  Spies are able to see who all other spies are, whereas resistance members
  are in the dark. Number of spies assigned is based on total number of players:

  | Players | 5 | 6 | 7 | 8 | 9 | 10 |
  | ------- | - | - | - | - | - | -- |
  | Spies   | 2 | 2 | 3 | 3 | 3 | 4  |

### Game Play

- Once players have had the chance to see whether or not they are a spy (and
  who the other spies are if they are a spy), up to 5 rounds of gameplay
  commence. Each round consists of a "Build the Team" (mission team approval)
  phase and a "Conduct the Mission" phase.

#### Build the Team

##### Mission Team Assignment

- Team lead discusses with players and proposes which players they would like
  to send on the mission (can send themself). Number of mission team players is
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

- All players (including lead) secretly vote Approve or Reject on the
  composition of the lead's selected mission team.
- Once all players have votes, the votes are revealed.
- If over 50% Approve, move to Conduct the Mission phase.
- Otherwise, the lead gets passed to the next player in player order and the
  Build the Team phase restart.
- If 5 mission teams are rejected in the same round, the spies immediately
  win the match.

#### Conduct the Mission

- Each mission team member secretly decides to either Support or Sabotage the
  mission.
- Non-spies can only decide to Support the mission.
- Member decisions are shuffled so no one knows who decided what.
- Mission succeeds only if all members Support the mission.
- Exception: In matches with 7 or more players, on the 4th mission, two
  Sabotage decisions are required to fail the mission.
- After mission success or failure, lead is passed to next player in player
  order, the round counter is incremented, and play restarts at the
  Build the Team phase.

Win
---

- Match ends immediatly after three successful or three failed missions, or
  if a mission team vote is not approved after 5 rounds of voting.

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
] as const
export type ResActionID = typeof RES_ACTIONS_ID[number]

export type ResRoundStatus = 'success' | 'failure' | 'current' | 'unplayed'
export type ResVoteStatus = 'approve' | 'reject' | 'voted' | 'notVoted'

export interface ResAction {
  type: ResActionID
  payload?: unknown
}

export type ResPlayerView = PlayerView

export interface ResRound {
  /** Player index of mission lead. */
  lead: number
  /**
   * For up to 5 voting rounds (1st array dimension), list of player indices
   * proposed by the lead to be on the mission team.
   **/
  team: number[][]
  /**
   * For up to 5 voting rounds (1st array dimension), the vote (true or false)
   * to approve the mission team per player (2nd dimension by player index).
   * Over 50% of players must vote true for mission team to be approved.
   * If no approval after 5 voting rounds, the spies win the game.
   **/
  votes: (boolean | null)[][]
  /**
   * Mission result: each player on mission team can pass (true) or fail (false)
   * the mission. All mission team players must pass for mission to succeed.
   */
  result: (boolean | null)[]
}

export type ResGame = BaseGame & {
  currentPlayer?: ResPlayerView
  /**
   * High-level phase of the game:
   * - `prep`: Prior to match start; players are still joining the game.
   * - `guess`: Actual game play, mission team voting, missions, etc.
   * - `win`: Once the resistance or spies have won the game.
   **/
  phase: ResPhase
  /** Current step (sub-phase) in the round. */
  step: ResStep
  /**
   * Player order by index is set at beginning of the match.
   * Team lead player is passed to the next player in order after each mission
   * or failed mission team vote round.
   **/
  player_order: number[]
  /**
   * List of player indices determining which players are spies (as opposed
   * to resistance members). Set at the beginning of the match.
   * When game state send to client, only if the client player's index is
   * included in the array is the list of spies send, to avoid being
   * able to see who else are spies for non-spies.
   **/
  spies: number[]
  /**
   * Match consists of 5 rounds (mission team approval + mission result).
   * Match is won by the resistance once a majority of round missions are passed
   * and by the spies if a majority of round missions are failed.
   */
  rounds: ResRound[]
}

export type ResGameView = ResGame & {
  type: GameType
  /** Currently not used, although prop is expected by some components. */
  commands: Command[]
}
