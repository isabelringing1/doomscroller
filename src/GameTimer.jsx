import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { endGame } from './store.js'

const GAME_DURATION_MS = 60_000
const WHITE_HEIGHT_PERCENT = 72.4
const ORANGE_HEIGHT_PERCENT = 22.9

export default function GameTimer() {
  const dispatch = useDispatch()
  const gameStartedAt = useSelector((s) => s.game.gameStartedAt)
  const health = useSelector((s) => s.game.health)
  const timerRef = useRef(null)
  const whiteRef = useRef(null)
  const redRef = useRef(null)

  useEffect(() => {
    if (gameStartedAt == null || health <= 0) return

    let rafId
    const tick = () => {
      const remaining = Math.max(0, 1 - (Date.now() - gameStartedAt) / GAME_DURATION_MS)
      const whiteHeight = remaining * WHITE_HEIGHT_PERCENT

      if (whiteRef.current) {
        whiteRef.current.style.height = `${whiteHeight}%`
      }
      if (redRef.current) {
        redRef.current.style.bottom = `${ORANGE_HEIGHT_PERCENT + whiteHeight}%`
      }
      if (timerRef.current) {
        timerRef.current.setAttribute('aria-valuenow', String(Math.ceil(remaining * 60)))
      }

      if (remaining === 0) {
        dispatch(endGame())
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(rafId)
  }, [dispatch, gameStartedAt, health])

  return (
    <div
      ref={timerRef}
      className="game-timer"
      role="progressbar"
      aria-label="Time remaining"
      aria-valuemin="0"
      aria-valuemax="60"
      aria-valuenow="60"
    >
      <div className="game-timer-track" />
      <div className="game-timer-orange" />
      <div ref={whiteRef} className="game-timer-white" />
      <div ref={redRef} className="game-timer-red" />
    </div>
  )
}
