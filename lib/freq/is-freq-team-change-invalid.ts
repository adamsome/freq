import { FreqGame } from '../../types/freq.types'
import { PlayerView } from '../../types/game.types'
import { isFreePhase, isGuessingPhase } from '../phase'
import { getNextPsychic } from './freq-psychic'

export default function isInvalidPlayerTeamChange(
  game: FreqGame,
  player: PlayerView
): string | undefined {
  const nextPsychic = getNextPsychic(game)
  if (
    player.id === nextPsychic?.id &&
    game.phase !== 'prep' &&
    game.phase !== 'win'
  )
    return "Cannot change the next psychic's team."

  // Any team change allowed in free phases
  if (isFreePhase(game.phase)) return

  if (player.id === game.psychic) return "Cannot change the psychic's team."

  if (isGuessingPhase(game.phase)) {
    if (game.guesses?.[player.id]?.value != null) {
      return "Cannot change a player who's already guessed."
    }
    if (game.directions?.[player.id]?.value != null) {
      return "Cannot change a player who's already guessed a direction."
    }
  }

  const team = game.players
    .filter((p) => p.team === player.team)
    .filter((p) => p.id !== player.id)
  if (team.length < 2)
    return 'Cannot change player team that leaves team empty.'
}
