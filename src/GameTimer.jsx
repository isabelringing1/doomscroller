import { useSelector } from 'react-redux'
import { INSTRUCTION_PROGRESS_PERCENT } from './store.js'

const WHITE_HEIGHT_PERCENT = 72.4
const ORANGE_HEIGHT_PERCENT = 22.9
const DEFAULT_TRANSITION_MS = 600

function getActiveDrain(game) {
  const { instructionSession: session, speedUpHeld } = game
  if (!session || session.status !== 'pending') return null

  const active = session.instructions
    .map((instruction, index) => ({ instruction, state: session.states[index], index }))
    .find(({ state }) =>
      state.visible
      && state.status === 'pending'
      && state.feedback !== 'failure',
    )

  if (!active) return null

  const { instruction, state, index } = active
  if (instruction.type.id === 'speed_up') {
    return (speedUpHeld || state.feedback === 'success') && instruction.holdDurationMs
      ? { durationMs: instruction.holdDurationMs }
      : null
  }

  if (instruction.type.id === 'watch') {
    const durationMs = session.instructions[index + 1]?.timeMs
    return durationMs > 0 ? { durationMs } : null
  }

  if (instruction.type.unjudgeable && instruction.holdDurationMs) {
    return { durationMs: instruction.holdDurationMs }
  }

  return null
}

export default function GameTimer() {
  const game = useSelector((s) => s.game)
  const progress = game.progress
  const scrollPuffId = useSelector((s) => s.feed.scrollPuffId)
  const activeDrain = getActiveDrain(game)
  const displayedProgress = activeDrain
    ? Math.max(0, progress - INSTRUCTION_PROGRESS_PERCENT)
    : progress
  const whiteHeight = (displayedProgress / 100) * WHITE_HEIGHT_PERCENT
  const transitionStyle = {
    '--game-timer-transition-ms': `${activeDrain?.durationMs ?? DEFAULT_TRANSITION_MS}ms`,
    '--game-timer-transition-easing': activeDrain ? 'linear' : 'ease-out',
  }

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
      <div
        className="game-timer-white"
        style={{ ...transitionStyle, height: `${whiteHeight}%` }}
      />
      <div
        className="game-timer-red"
        style={{
          ...transitionStyle,
          bottom: `${ORANGE_HEIGHT_PERCENT + whiteHeight}%`,
        }}
      />
    </div>
  )
}
