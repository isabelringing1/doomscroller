import { isMobileDevice } from './Util.js'

const AUTOSTART_KEY = 'doomscroller-autostart'

function startWithReload(zenMode) {
  sessionStorage.setItem(AUTOSTART_KEY, zenMode ? 'zen' : 'normal')
  window.location.reload()
}

export default function TitlePage() {
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
      <div className="title-page-packaging" aria-hidden="true" />
      <div className="title-page-gold-bar" aria-hidden="true" />
      <div className="title-page-bottom-bar" aria-hidden="true" />
      <div className="title-page-original">Original</div>

      <main className="title-page-content">
        <h1 className="title-page-heading">Phone<span style={{ fontSize: '3.9dvh' }}> </span>Cigarette</h1>
        <p className="title-page-subheading">
          Immersive simulation
          <br />
          of consuming content
        </p>

        <div className="title-page-directions">
          <strong>Directions:</strong>
          <span>Use when craving the dopamine</span>
          <span>hit of scrolling social media.</span>
        </div>

        <button type="button" className="title-page-start" onClick={() => startWithReload(true)}>
          Start
        </button>
      </main>
    </div>
  )
}
