import { useDispatch } from 'react-redux'
import { startGame } from './store.js'
import { getHighScore } from './highScore.js'
import { isMobileDevice } from './Util.js'

export default function TitlePage() {
  const dispatch = useDispatch()
  const highScore = getHighScore()

  if (!isMobileDevice()) {
    return (
      <div className="title-page">
        <p className="title-page-desktop-message">
          DoomScroller does not work on desktop! Please visit on a mobile device to play.
        </p>
      </div>
    )
  }

  return (
    <div className="title-page">
      <h1 className="title-page-heading">DoomScroller</h1>
      <div className="title-page-subheading">An immersive simulation of consuming content.</div>
      
      <div className="title-page-buttons">
        <button type="button" className="title-page-start" onClick={() => dispatch(startGame({ zenMode: false }))}>
          Start Game
        </button>
        {highScore > 0 && <p className="title-page-high-score">High Score: {highScore}</p>}
        <button type="button" className="zen-mode-button title-page-start" onClick={() => dispatch(startGame({ zenMode: true }))}>
          Zen Mode
        </button>
      </div>

      
    </div>
  )
}
