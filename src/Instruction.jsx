import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { anchorAlign, isInstructionBlocked } from './Util.js'
import { instructionVisible } from './store.js'

export default function Instruction({
  type,
  timePercent,
  duration,
  active,
  pageIndex,
  instructionIndex,
  position,
}) {
  const dispatch = useDispatch()
  const session = useSelector((s) => s.game.instructionSession)
  const scrollDirection = useSelector((s) => s.feed.scrollDirection)
  const [timerReady, setTimerReady] = useState(false)
  const [runId, setRunId] = useState(0)
  const [shown, setShown] = useState(false)

  const sessionMatchesPage = session?.pageIndex === pageIndex
  const instructionState = sessionMatchesPage ? session.states[instructionIndex] : null
  const feedback = instructionState?.feedback ?? null
  const isCompleted = instructionState?.status === 'completed'
  const blocked = sessionMatchesPage && isInstructionBlocked(session, instructionIndex)
  const visible = timerReady && !blocked

  const isActiveScrollInstruction =
    (type.id === 'scroll_down' || type.id === 'scroll_up')
    && instructionState?.visible
    && instructionState?.status === 'pending'

  const scrollDirectionMatches =
    (type.id === 'scroll_down' && scrollDirection === 'down')
    || (type.id === 'scroll_up' && scrollDirection === 'up')

  useEffect(() => {
    if (!active) {
      setTimerReady(false)
      return
    }
    setTimerReady(false)
    setRunId((id) => id + 1)
  }, [active])

  useEffect(() => {
    if (!active) return
    const delayMs = (timePercent / 100) * duration * 1000
    const timer = setTimeout(() => setTimerReady(true), delayMs)
    return () => clearTimeout(timer)
  }, [active, runId, timePercent, duration])

  useEffect(() => {
    if (!active || !visible) return
    dispatch(instructionVisible({ pageIndex, instructionIndex }))
  }, [active, visible, pageIndex, instructionIndex, dispatch])

  useEffect(() => {
    if (type.unjudgeable) return
    if (isCompleted) setTimerReady(false)
  }, [isCompleted, type.unjudgeable])

  useEffect(() => {
    if (!visible) {
      setShown(false)
      return
    }
    setShown(false)
    const frame = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(frame)
  }, [visible, runId])

  if (!active || !visible) return null

  const feedbackClass =
    feedback === 'success' || (scrollDirectionMatches && isActiveScrollInstruction)
      ? ' instruction-text--success'
      : feedback === 'failure'
        ? ' instruction-text--failure'
        : ''

  const align = anchorAlign(position.anchor)

  return (
    <div
      className={`instruction instruction--anchor-${align}`}
      style={{ left: `${position.vw}vw`, bottom: `${position.dvh}dvh` }}
    >
      <span className={`instruction-text${feedbackClass}${shown ? ' instruction-text--shown' : ''}`}>
        {type.display_text}
      </span>
    </div>
  )
}
