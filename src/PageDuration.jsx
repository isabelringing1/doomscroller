import { useEffect, useMemo, useState } from 'react'
import { durationForIndex } from './pageMeta.js'

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
