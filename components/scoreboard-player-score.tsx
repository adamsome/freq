type Props = {
  score: number
}

export default function ScoreboardPlayerScore({ score }: Props) {
  return <div className="text-center font-semibold">{score}</div>
}
