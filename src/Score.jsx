import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export default function Score() {
  const score = useSelector((s) => s.game.score)
  const prevScoreRef = useRef(score)
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      setPulsing(true)
    }
    prevScoreRef.current = score
  }, [score])

  return (
    <div className={`score${pulsing ? ' score--pulse' : ''}`}>
      Score:{' '}
      <span
        className={`score-value${pulsing ? ' score-value--pulse' : ''}`}
        onAnimationEnd={() => setPulsing(false)}
      >
        {score}
      </span>
    </div>
  )
}
