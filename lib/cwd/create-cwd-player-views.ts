import { CwdGame } from '../../types/cwd.types'
import { PlayerView } from '../../types/game.types'
import { toTruthMap } from '../../util/object'
import { getTeamPlayers } from '../player'
import { calculateCwdPlayerPoints } from './cwd-stats'

export default function createCwdPlayerViews(
  game: CwdGame,
  currentID?: string
): PlayerView[] {
  const activeByPlayerID = toTruthMap(getActivePlayers(game))
  const isPrep = game.phase === 'prep'

  return game.players.map(
    (p): PlayerView => ({
      ...p,
      active: activeByPlayerID[p.id],
      current: p.id === currentID,
      psychic: game.psychic_1 === p.id || game.psychic_2 === p.id,
      designatedPsychic:
        game.settings?.designated_psychic === true && game.psychic_1 === p.id,
      showPsychic: game.psychic_1 === p.id || game.psychic_2 === p.id,
      canSetPsychic: isPrep,
      canChangeTeam: isPrep,
      points: calculateCwdPlayerPoints(game.stats?.[p.id]),
      wins: game.stats?.[p.id]?.w,
    })
  )
}

function getActivePlayers(game: CwdGame): string[] {
  switch (game.phase) {
    case 'guess': {
      const { players, team_turn } = game
      return getTeamPlayers(players, team_turn).map((p) => p.id)
    }
  }
  return []
}
