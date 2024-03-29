import { getPlayersPerTeam } from '../lib/player'
import { GameType, PlayerView, ScoreType } from '../lib/types/game.types'
import { range } from '../lib/util/array'
import { cx } from '../lib/util/dom'
import ScoreboardIcon from './scoreboard-icon'
import ScoreboardPlayerName from './scoreboard-player-name'
import ScoreboardPlayerRow from './scoreboard-player-row'
import ScoreboardPlayerScore from './scoreboard-player-score'
import SkeletonBox from './layout/skeleton-box'

type Props = typeof defaultProps & {
  type?: GameType
  currentPlayer?: PlayerView
  players?: PlayerView[]
  scoreType: ScoreType
  onPlayerClick: (player: PlayerView) => void
}

const defaultProps = {
  readonly: false,
}

const skeletonTeam = range(0, 3).map(() => undefined)
const skeletonTeams = [skeletonTeam, skeletonTeam] as const

export default function ScoreboardGrid({
  type,
  currentPlayer,
  players,
  scoreType,
  readonly,
  onPlayerClick,
}: Props) {
  const teams: readonly [
    (PlayerView | undefined)[],
    (PlayerView | undefined)[]
  ] = players
    ? getPlayersPerTeam(players.filter((p) => !p.designatedPsychic))
    : skeletonTeams

  const createPlayer = (right = false) =>
    function Player(player: PlayerView | undefined, i: number) {
      if (!player)
        return (
          <SkeletonBox key={i} className="mb-2 h-8 w-full" rounded={false} />
        )

      const score = (scoreType === 'points' ? player.points : player.wins) ?? 0
      return (
        <ScoreboardPlayerRow
          key={player.id}
          player={player}
          right={right}
          active={player.active}
          current={player.current}
          leader={currentPlayer?.leader}
          readonly={readonly}
          onClick={() => currentPlayer?.leader && onPlayerClick(player)}
        >
          <ScoreboardIcon right={right}>{player.icon}</ScoreboardIcon>
          <ScoreboardPlayerName
            type={type}
            player={player}
            right={right}
            psychic={player.showPsychic}
            nextPsychic={player.showNextPsychic}
          />
          <ScoreboardPlayerScore score={score} />
        </ScoreboardPlayerRow>
      )
    }

  const Team = (team: (PlayerView | undefined)[], i: number) => (
    <div
      key={i}
      className={cx('pt-1', {
        'border-r border-black last:border-r-0 dark:border-white': !readonly,
      })}
    >
      {team.map(createPlayer(i === 1))}
    </div>
  )

  return <div className="grid w-full grid-cols-2">{teams.map(Team)}</div>
}

ScoreboardGrid.defaultProps = defaultProps
