import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetFeed, startOver } from './store.js'
import { updateHighScore } from './highScore.js'

export default function GameOver() {
  const dispatch = useDispatch()
  const score = useSelector((s) => s.game.score)

  useEffect(() => {
    updateHighScore(score)
  }, [score])

  const onStartOver = () => {
    dispatch(startOver())
    dispatch(resetFeed())
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over-popup">
        <h1 className="game-over-title">You Lost</h1>
        <p className="game-over-score">Score: {score}</p>
        <button type="button" className="game-over-start-over" onClick={onStartOver}>
          Start Over
        </button>
      </div>
    </div>
  )
}
