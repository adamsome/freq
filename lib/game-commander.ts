import { CommandType, Game, GameView, Player } from '../types/game.types'
import { RequestWithSession } from '../types/io.types'
import { User, UserConnected } from '../types/user.types'
import { randomClues } from './clue'
import { assignColor } from './color-dict'
import {
  doesGameHaveEnoughPlayers,
  getNextPsychic,
  getPsychic,
  isInvalidPlayerTeamChange,
} from './game'
import {
  deleteGameProp,
  fetchGame,
  leaveGame,
  updateGamePath,
} from './game-store'
import { toGameView } from './game-view'
import { areAllDirectionGuessesSet, areAllNeedleGuessesLocked } from './guess'
import { isFreePhase, isGuessingPhase } from './phase'
import { getRoundScores } from './score'

export class GameCommander
  implements Record<CommandType, (val?: any) => Promise<void>> {
  get player(): Player | undefined {
    return this.game.currentPlayer
  }

  constructor(public game: GameView, private user: UserConnected) {}

  // Player Commands

  async change_player_team(player: Player) {
    const invalidMessage = isInvalidPlayerTeamChange(this.game, player)
    if (invalidMessage) throw new Error(invalidMessage)

    const index = this.game.players.findIndex((p) => p.id === player.id)
    if (index < 0)
      throw new Error('Cannot change player team when player index not found.')

    const newTeam = player.team === 1 ? 2 : 1
    const existingColors = this.game.players.map((p) => p.color)
    const color = assignColor(newTeam, existingColors)
    await this.updatePath(`players.${index}.team`, newTeam)
    await this.updatePath(`players.${index}.color`, color)
  }

  async edit_player(player: Player) {
    if (!this.player || this.player.id !== player.id)
      throw new Error('Players can only change their own name.')

    const index = this.game.players.findIndex((p) => p.id === player.id)
    if (index < 0)
      throw new Error('Cannot change player team when player index not found.')

    const nextPlayer = { ...this.player, name: player.name, icon: player.icon }
    await this.updatePath(`players.${index}`, nextPlayer)
  }

  async toggle_player_leader(player: Player) {
    // TODO: Enable once development complete
    // if (!this.player.leader)
    //   throw new Error('Only leaders can make other players leaders.')

    const index = this.game.players.findIndex((p) => p.id === player.id)
    if (index < 0)
      throw new Error('Cannot change player team when player index not found.')

    await this.updatePath(`players.${index}.leader`, !player.leader)
  }

  async set_next_psychic(player: Player) {
    const allow = this.game.canChangePsychicTo
    if (allow === 'none')
      throw new Error('Can only change the psychic in the free phases.')

    if (
      allow === 'same_team' &&
      player.team !== getNextPsychic(this.game)?.team
    )
      throw new Error('Can only change psychic within same team during game')

    if (player.team == null)
      throw new Error('Cannot make audience members the psychic')

    await this.update('next_psychic', player.id)
  }

  async set_current_psychic(player: Player) {
    if (this.game.phase !== 'choose')
      throw new Error('Can only change the psychic in the choose phase.')

    if (player.team !== getPsychic(this.game)?.team)
      throw new Error('Can only change psychic within same team during game')

    await this.update('psychic', player.id)
  }

  async kick_player(player: Player) {
    if (!this.player?.leader) throw new Error('Only leaders can kick players.')

    leaveGame(this.game.room, player.id)
    await this.updatePath(`kicked.${player.id}`, true)
  }

  // Phase Commands

  async prep_new_match() {
    if (!this.player?.leader)
      throw new Error('Only leaders can start new match')

    await this.update('score_team_1', 0)
    await this.update('score_team_2', 0)
    await this.update('phase', 'prep')
  }

  async begin_round() {
    if (!isFreePhase(this.game.phase))
      throw new Error('Can only begin a round from the free phases.')

    if (!doesGameHaveEnoughPlayers(this.game))
      throw new Error('Must have at least 2 players per team to begin round.')

    const players = this.game.players

    // Need to pick a the next psychic and set turn to their team
    const psychic = getNextPsychic(this.game) ?? this.game.players[0]
    await this.update('psychic', psychic.id)
    await this.update('team_turn', psychic.team ?? 1)

    // Update the psychic player's psychic_count
    const psychicIndex = players.findIndex((p) => p.id === psychic.id)
    if (psychicIndex < 0) {
      throw new Error('Unexpected error: no next psychic index found.')
    }
    const nextCount = (psychic.psychic_count ?? 0) + 1
    await this.updatePath(`players.${psychicIndex}.psychic_count`, nextCount)

    if (this.game.phase !== 'reveal') {
      // Reset the scores based on which team is up (0); other team (1)
      await this.update('score_team_1', psychic.team === 1 ? 0 : 1)
      await this.update('score_team_2', psychic.team === 1 ? 1 : 0)
      await this.update('match_number', this.game.match_number + 1)
    }

    await this.delete('next_psychic')
    await this.delete('clue_selected')
    await this.delete('guesses')
    await this.delete('directions')

    const minWidth = this.game.target_width / 5 / 2 / 100
    const target = Math.max(minWidth, Math.min(Math.random(), 1 - minWidth))
    await this.update('target', target)
    await this.update('clues', randomClues())
    await this.update('round_number', this.game.round_number + 1)
    await this.update('round_started_at', new Date().toISOString())

    await this.update('phase', 'choose')
  }

  async select_clue(clueIndex: number) {
    if (this.game.psychic !== this.user.id)
      throw new Error('Only psychic can select clue.')

    if (this.game.phase !== 'choose')
      throw new Error('Can only confirm clue in the choose phase.')

    await this.update('clue_selected', clueIndex)
  }

  async confirm_clue() {
    if (this.player?.id !== this.game.psychic)
      throw new Error('Only psychic can confirm clue.')

    if (this.game.phase !== 'choose')
      throw new Error('Can only confirm clue in the choose phase.')

    if (this.game.clue_selected == null)
      throw new Error('A clue must be selected to confirm.')

    await this.update('phase', 'guess')
  }

  async set_guess(guess: number) {
    if (!this.player) throw new Error('Player is not a member of the game.')

    const isPlayerTurn = this.player?.team === this.game.team_turn
    if (this.game.psychic === this.user.id || !isPlayerTurn)
      throw new Error('Only non-psychic players on turn team can set guess.')

    if (this.game.phase !== 'guess')
      throw new Error('Can only lock guess in the guess phase.')

    if (this.player && this.game.guesses?.[this.player.id]?.locked)
      throw new Error('Cannot set guess once its locked.')

    await this.updatePath(`guesses.${this.player.id}.value`, guess)
  }

  async lock_guess() {
    if (!this.player) throw new Error('Player is not a member of the game.')

    const isPlayerTurn = this.player.team === this.game.team_turn
    if (this.game.psychic === this.user.id || !isPlayerTurn)
      throw new Error('Only non-psychic players on turn team can lock guess.')

    if (this.game.phase !== 'guess')
      throw new Error('Can only lock guess in the guess phase.')

    if (this.game.guesses?.[this.player.id]?.value == null)
      throw new Error('Can only lock guess once one is made.')

    await this.updatePath(`guesses.${this.player.id}.locked`, true)

    if (!areAllNeedleGuessesLocked(this.game, this.player)) return

    await this.update('phase', 'direction')
  }

  async set_direction(directionGuess: 1 | -1) {
    if (!this.player) throw new Error('Player is not a member of the game.')

    if (this.player.team === this.game.team_turn)
      throw new Error('Only players not on turn team can set direction.')

    if (this.game.phase !== 'direction')
      throw new Error('Can only lock direction in the direction phase.')

    if (this.game.directions?.[this.player.id]?.value != null)
      throw new Error('Cannot set direction once its locked.')

    await this.updatePath(`directions.${this.player.id}.value`, directionGuess)

    // Update the guess since we'll need the updated guesses to calculate
    // if guesses are set and the round scores in the reveal phase
    await this.refetch()

    if (!areAllDirectionGuessesSet(this.game)) return

    await this.reveal()
  }

  async reveal() {
    if (!isGuessingPhase(this.game.phase))
      throw new Error('Can only reveal from a guessing phase.')

    await this.update('phase', 'reveal')

    // Get round scores and add to state scores
    const scoreInfo = getRoundScores(this.game)
    const [score1, score2, scoreByPlayer] = scoreInfo
    const nextScore1 = this.game.score_team_1 + score1
    const nextScore2 = this.game.score_team_2 + score2
    await this.update('score_team_1', nextScore1)
    await this.update('score_team_2', nextScore2)

    for (let i = 0; i < this.game.players.length; i++) {
      const p = this.game.players[i]
      const nextScore = (scoreByPlayer[p.id] ?? 0) + (p.score ?? 0)
      await this.updatePath(`players.${i}.score`, nextScore)
    }

    if ((nextScore1 >= 10 || nextScore2 >= 10) && nextScore1 !== nextScore2) {
      return await this.win()
    }
  }

  private async win() {
    await this.update('phase', 'win')
    await this.update('game_finished_at', new Date().toISOString())
  }

  // Helpers

  private update<K extends keyof Game>(prop: K, value: Game[K]) {
    return updateGamePath(this.game.room, prop, value)
  }

  private delete<K extends keyof Game>(prop: K) {
    return deleteGameProp(this.game.room, prop)
  }

  private updatePath(path: string, value: any) {
    return updateGamePath(this.game.room, path, value)
  }

  private async refetch() {
    const gameView = await GameCommander.fetchGameView(this.user)
    this.game = gameView
  }

  private static async fetchGameView(user: UserConnected) {
    const game = await fetchGame(user.room)

    if (!game) {
      throw new Error(
        `Cannot create game commander when no game found for room ` +
          `'${user.room}'.`
      )
    }

    return toGameView(user.id, game, true)
  }

  static async fromRequest(req: RequestWithSession): Promise<GameCommander> {
    const user: User | undefined = req.session.get('user')

    if (!user || !user.connected) {
      throw new Error('Cannot create game commander with no user session.')
    }

    const gameView = await GameCommander.fetchGameView(user)
    return new GameCommander(gameView, user)
  }
}
