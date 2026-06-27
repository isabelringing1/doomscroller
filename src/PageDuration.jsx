import { useEffect, useState } from 'react'

export default function PageDuration({ active, duration }) {
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!active) return
    setRunId((id) => id + 1)
  }, [active, duration])

  return (
    <div className="page-duration">
      {active && (
        <div
          key={runId}
          className="page-duration-bar"
          style={{ animationDuration: `${duration}s` }}
        />
      )}
    </div>
  )
}
