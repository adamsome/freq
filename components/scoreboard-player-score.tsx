type Props = typeof defaultProps & {
  score: number
}

const defaultProps = {}

export default function ScoreboardPlayerScore({ score }: Props) {
  return <div className="text-center font-semibold">{score}</div>
}

ScoreboardPlayerScore.defaultProps = defaultProps
