import { useDispatch } from 'react-redux'
import { startGame } from './store.js'
import { getHighScore } from './highScore.js'

export default function TitlePage() {
  const dispatch = useDispatch()
  const highScore = getHighScore()

  return (
    <div className="title-page">
      <h1 className="title-page-heading">Doomscroller</h1>
      
      <button type="button" className="title-page-start" onClick={() => dispatch(startGame())}>
        Start
      </button>

      <p className="title-page-high-score">High Score: {highScore}</p>
    </div>
  )
}
