import { useDispatch, useSelector } from 'react-redux'
import { resetFeed, startOver } from './store.js'
import { resetGameOverHighScore, resolveGameOverHighScore } from './highScore.js'
import { resetZenModeUnlock, resolveZenModeUnlock } from './zenModeUnlock.js'
import { formatGameDuration } from './Util.js'

export default function GameOver() {
  const dispatch = useDispatch()
  const score = useSelector((s) => s.game.score)
  const gameDurationMs = useSelector((s) => s.game.gameDurationMs)
  const isNewHighScore = resolveGameOverHighScore(score)
  const isZenModeJustUnlocked = resolveZenModeUnlock()

  const onStartOver = () => {
    resetGameOverHighScore()
    resetZenModeUnlock()
    dispatch(startOver())
    dispatch(resetFeed())
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over-popup">
        <h1 className="game-over-title">Game Over</h1>
        {gameDurationMs != null && (
          <p className="game-over-duration">
            {formatGameDuration(gameDurationMs)} of content consumed
          </p>
        )}
        <p className="game-over-score">Score: {score}</p>
        {isNewHighScore && (
          <p className="game-over-new-high-score">New High Score!</p>
        )}
        {isZenModeJustUnlocked && (
          <p className="game-over-zen-unlocked">Zen Mode Unlocked!</p>
        )}
        <button type="button" className="game-over-start-over" onClick={onStartOver}>
          Start Over
        </button>
      </div>
    </div>
  )
}
