import { useSelector } from 'react-redux'

export default function GameOver() {
  const score = useSelector((s) => s.game.score)

  return (
    <div className="game-over-overlay">
      <div className="game-over-popup">
        <h1 className="game-over-title">You Lost</h1>
        <p className="game-over-score">Score: {score}</p>
      </div>
    </div>
  )
}
