import { FreqGame } from '../../types/freq.types'
import { Player, PlayerView } from '../../types/game.types'
import { toTruthMap } from '../../util/object'
import { isFreePhase } from '../phase'
import { getTeamPlayers } from '../player'
import { calculateFreqPlayerPoints } from './freq-player-stats'
import { getNextPsychic } from './freq-psychic'
import isInvalidPlayerTeamChange from './is-freq-team-change-invalid'

export default function createFreqPlayerViews(
  game: FreqGame,
  playerID?: string
): PlayerView[] {
  const activeByPlayerID = toTruthMap(getActivePlayers(game))
  const nextPsychic = getNextPsychic(game)
  const showPsychic = game.phase !== 'prep'
  const showNextPsychic = isFreePhase(game.phase) || game.next_psychic != null

  return game.players.map(
    (p): PlayerView => {
      const isPsychic = game.psychic === p.id
      const isNextPsychic = nextPsychic?.id === p.id
      const canSetPsychic =
        !isPsychic &&
        !isNextPsychic &&
        game.phase === 'choose' &&
        p.team === game.team_turn

      return {
        ...p,
        active: activeByPlayerID[p.id],
        current: p.id === playerID,
        psychic: isPsychic,
        nextPsychic: isNextPsychic,
        showPsychic: showPsychic && !isNextPsychic && isPsychic,
        showNextPsychic: showNextPsychic && isNextPsychic,
        canSetPsychic,
        canSetNextPsychic: canChangeNextPsychic(game, p, nextPsychic),
        canChangeTeam: !isInvalidPlayerTeamChange(game, p),
        points: calculateFreqPlayerPoints(game.stats?.[p.id]),
        wins: game.stats?.[p.id].w,
      }
    }
  )
}

function getActivePlayers(game: FreqGame): string[] {
  switch (game.phase) {
    case 'choose': {
      return [game.psychic]
    }
    case 'guess': {
      const { players, team_turn, psychic } = game
      return getTeamPlayers(players, team_turn, psychic)
        .filter((p) => !game.guesses?.[p.id]?.locked)
        .map((p) => p.id)
    }
    case 'direction': {
      const { players, team_turn } = game
      const otherTeam = team_turn === 1 ? 2 : 1
      return getTeamPlayers(players, otherTeam)
        .filter((p) => !game.directions?.[p.id]?.locked)
        .map((p) => p.id)
    }
  }
  return []
}

function canChangeNextPsychic(
  game: FreqGame,
  player: PlayerView,
  nextPsychic: Player | undefined
): boolean {
  if (player.showPsychic || player.showNextPsychic) return false

  switch (game.phase) {
    case 'prep':
    case 'win':
      return true
    case 'choose':
    case 'reveal': {
      return !nextPsychic || player.team === nextPsychic?.team
    }
    default:
      return false
  }
}