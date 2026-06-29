import { useDispatch } from 'react-redux'
import { startGame } from './store.js'
import { getHighScore } from './highScore.js'

export default function TitlePage() {
  const dispatch = useDispatch()
  const highScore = getHighScore()

  return (
    <div className="title-page">
      <h1 className="title-page-heading">DoomScroller</h1>
      <div className="title-page-subheading">Relax with this immersive and engaging simulation of consuming content.</div>
      
      <button type="button" className="title-page-start" onClick={() => dispatch(startGame())}>
        Start
      </button>

      {highScore > 0 && <p className="title-page-high-score">High Score: {highScore}</p>}
    </div>
  )
}
