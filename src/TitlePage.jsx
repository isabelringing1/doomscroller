import { getHighScore } from './highScore.js'
import { isZenModeUnlocked } from './zenModeUnlock.js'
import { isMobileDevice } from './Util.js'

const AUTOSTART_KEY = 'doomscroller-autostart'

function startWithReload(zenMode) {
  sessionStorage.setItem(AUTOSTART_KEY, zenMode ? 'zen' : 'normal')
  window.location.reload()
}

export default function TitlePage() {
  const highScore = getHighScore()
  const zenModeUnlocked = isZenModeUnlocked()

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
        <button type="button" className="title-page-start" onClick={() => startWithReload(false)}>
          Start Game
        </button>
        {highScore > 0 && <p className="title-page-high-score">High Score: {highScore}</p>}
        {zenModeUnlocked && (
          <button type="button" className="zen-mode-button title-page-start" onClick={() => startWithReload(true)}>
            Zen Mode
          </button>
        )}
      </div>

      
    </div>
  )
}
