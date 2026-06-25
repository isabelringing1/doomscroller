import { useEffect, useMemo, useState } from 'react'

function durationForIndex(index) {
  const t = Math.abs(Math.sin((index + 1) * 12.9898) * 43758.5453) % 1
  return 5 + t * 10
}

export default function PageDuration({ index, active }) {
  const duration = useMemo(() => durationForIndex(index), [index])
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!active) return
    setRunId((id) => id + 1)
  }, [active])

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
