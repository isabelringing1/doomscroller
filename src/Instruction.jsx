import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { instructionVisible } from './store.js'

export default function Instruction({ type, timePercent, duration, active, pageIndex }) {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [runId, setRunId] = useState(0)

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

  if (!active) return null

  return (
    <div className={`instruction-overlay${visible ? ' instruction-overlay--visible' : ''}`}>
      <span className="instruction-text">{type.display_text}</span>
    </div>
  )
}
