import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { speedUpTierForIndex } from './pageMeta.js'

const NOTICE_MS = 1400

export default function SpeedUpNotice() {
  const currentIndex = useSelector((s) => s.feed.currentIndex)
  const feedGeneration = useSelector((s) => s.feed.feedGeneration)
  const titleDismissed = useSelector((s) => s.feed.titleDismissed)
  const zenMode = useSelector((s) => s.game.zenMode)
  const [visible, setVisible] = useState(false)
  const prevIndexRef = useRef(currentIndex)

  useEffect(() => {
    prevIndexRef.current = currentIndex
    setVisible(false)
  }, [feedGeneration])

  useEffect(() => {
    if (!titleDismissed || zenMode) return

    const prevIndex = prevIndexRef.current
    if (currentIndex > prevIndex) {
      const tier = speedUpTierForIndex(currentIndex)
      const prevTier = speedUpTierForIndex(prevIndex)
      if (tier > prevTier) {
        setVisible(true)
      }
    }

    prevIndexRef.current = currentIndex
  }, [currentIndex, titleDismissed, zenMode])

  useEffect(() => {
    if (!visible) return
    const hideTimer = setTimeout(() => setVisible(false), NOTICE_MS)
    return () => clearTimeout(hideTimer)
  }, [visible, currentIndex])

  if (!visible) return null

  return (
    <div key={currentIndex} className="speed-up-notice">
      Speed Up!
    </div>
  )
}
