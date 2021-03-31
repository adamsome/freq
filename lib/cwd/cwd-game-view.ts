import { OptionalId, WithId } from 'mongodb'
import { CwdGame, CwdGameView, FullCwdGameView } from '../../types/cwd.types'
import { canChangePsychicTo } from '../phase'
import buildCwdCodeViews from './build-cwd-code-views'
import createCwdCommandView from './create-cwd-command-view'
import createCwdPlayerViews from './create-cwd-player-views'
import getCwdWinner from './get-cwd-winner'

export function toCwdGameView(
  id: string | undefined,
  game: OptionalId<WithId<CwdGame>>
): CwdGameView {
  const players = createCwdPlayerViews(game, id)
  const currentPlayer = players.find((p) => p.id === id)
  const commandsView = createCwdCommandView(game, currentPlayer)
  const codes = buildCwdCodeViews(game, currentPlayer)

  const view: OptionalId<WithId<CwdGameView>> = {
    type: 'cwd',
    ...game,
    ...commandsView,
    currentPlayer,
    players,
    codes,
    winner: getCwdWinner(game),
    canChangePsychicTo: canChangePsychicTo(game.phase),
  }

  delete view._id
  return view
}

export function toFullCwdGameView(
  playerID: string,
  game: OptionalId<WithId<CwdGame>>
): FullCwdGameView {
  const fullGameView = {
    ...toCwdGameView(playerID, game),
    code_words: game.code_words,
    code_states: game.code_states,
  }

  if (!isFullCwdGameView(fullGameView)) {
    const message = `Cannot create full game view w/ no current user.`
    throw new Error(message)
  }

  return fullGameView
}

export function isCwdGameView(game: any): game is CwdGameView {
  return (
    game.codes != null &&
    game.code_reveals != null &&
    game.phase != null &&
    game.players != null &&
    game.psychic_history != null &&
    game.room != null &&
    game.team_turn != null
  )
}

function isFullCwdGameView(game: any): game is FullCwdGameView {
  return (
    game.currentPlayer != null &&
    game.code_words != null &&
    game.code_states != null &&
    game.code_reveals != null &&
    game.phase != null &&
    game.players != null &&
    game.room != null &&
    game.team_turn != null
  )
}
