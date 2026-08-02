import { useSelector } from 'react-redux'

const WHITE_HEIGHT_PERCENT = 72.4
const ORANGE_HEIGHT_PERCENT = 22.9

export default function GameTimer() {
  const progress = useSelector((s) => s.game.progress)
  const scrollPuffId = useSelector((s) => s.feed.scrollPuffId)
  const whiteHeight = (progress / 100) * WHITE_HEIGHT_PERCENT

  return (
    <div
      className="game-timer"
      role="progressbar"
      aria-label="Cigarette progress remaining"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
    >
      <div className="game-timer-track" />
      <div className="game-timer-orange" />
      {scrollPuffId > 0 && (
        <div key={scrollPuffId} className="game-timer-smoke" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
      <div className="game-timer-white" style={{ height: `${whiteHeight}%` }} />
      <div
        className="game-timer-red"
        style={{ bottom: `${ORANGE_HEIGHT_PERCENT + whiteHeight}%` }}
      />
    </div>
  )
}
