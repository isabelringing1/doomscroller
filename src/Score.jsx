import { useSelector } from 'react-redux'

export default function Score() {
  const score = useSelector((s) => s.game.score)

  return <div className="score">Score: {score}</div>
}
