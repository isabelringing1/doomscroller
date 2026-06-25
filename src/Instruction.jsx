import { useEffect, useState } from 'react'

export default function Instruction({ type, timePercent, duration, active }) {
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
    console.log(delayMs)
    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [active, runId, timePercent, duration])

  if (!active) return null

  return (
    <div className={`instruction-overlay${visible ? ' instruction-overlay--visible' : ''}`}>
      <span className="instruction-text">{type.display_text}</span>
    </div>
  )
}
