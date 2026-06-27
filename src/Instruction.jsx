import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { instructionVisible } from './store.js'

export default function Instruction({ type, timePercent, duration, active, pageIndex }) {
  const dispatch = useDispatch()
  const session = useSelector((s) => s.game.instructionSession)
  const scrollDirection = useSelector((s) => s.feed.scrollDirection)
  const feedback = session?.pageIndex === pageIndex ? session.feedback : null
  const [visible, setVisible] = useState(false)
  const [runId, setRunId] = useState(0)

  const isActiveScrollInstruction =
    (type.id === 'scroll_down' || type.id === 'scroll_up')
    && session?.pageIndex === pageIndex
    && session?.visible
    && session?.status === 'pending'

  const scrollDirectionMatches =
    (type.id === 'scroll_down' && scrollDirection === 'down')
    || (type.id === 'scroll_up' && scrollDirection === 'up')

  useEffect(() => {
    if (!active) {
      setVisible(false)
      return
    }
    setVisible(false)
    setRunId((id) => id + 1)
  }, [active])

  useEffect(() => {
    if (!active) return
    const delayMs = (timePercent / 100) * duration * 1000
    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [active, runId, timePercent, duration])

  useEffect(() => {
    if (!active || !visible) return
    dispatch(instructionVisible({ pageIndex }))
  }, [active, visible, pageIndex, dispatch])

  useEffect(() => {
    if (session?.pageIndex === pageIndex && session.status === 'completed') {
      setVisible(false)
    }
  }, [session?.pageIndex, session?.status, pageIndex])

  if (!active) return null

  const feedbackClass = scrollDirectionMatches && isActiveScrollInstruction && visible
    ? ' instruction-text--success'
    : feedback === 'success'
      ? ' instruction-text--success'
      : ''

  return (
    <div className={`instruction-overlay${visible ? ' instruction-overlay--visible' : ''}`}>
      <span className={`instruction-text${feedbackClass}`}>{type.display_text}</span>
    </div>
  )
}
