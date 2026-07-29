import { useEffect, useRef } from 'react'
import { isMobileDevice } from './Util.js'

const AUTOSTART_KEY = 'doomscroller-autostart'
const DEFAULT_PEEL = 0.1
const HOVER_PEEL = 0.15
const PEEL_OFF_DURATION = 500
const START_DELAY = 200

function startWithReload(zenMode) {
  sessionStorage.setItem(AUTOSTART_KEY, zenMode ? 'zen' : 'normal')
  window.location.reload()
}

function PeelableStartButton() {
  const elementRef = useRef(null)
  const peelRef = useRef(null)
  const progressRef = useRef(DEFAULT_PEEL)
  const animationRef = useRef(null)
  const startingRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    const Peel = window.Peel
    if (!element || !Peel) {
      element?.classList.add('peel-ready')
      return undefined
    }

    const peel = new Peel(element, {
      corner: Peel.Corners.BOTTOM_LEFT,
      setPeelOnInit: false,
      backReflection: true,
      backReflectionAlpha: 0.18,
      bottomShadowDarkAlpha: 0.28,
      bottomShadowLightAlpha: 0.08,
    })
    peel.setFadeThreshold(0.9)
    peelRef.current = peel

    const setPath = () => {
      peel.setupDimensions()
      peel.setCorner(Peel.Corners.BOTTOM_LEFT)
      peel.setPeelPath(0, peel.height, peel.width * 2, peel.height)
      peel.setTimeAlongPath(progressRef.current)
    }

    setPath()
    const resizeObserver = new ResizeObserver(setPath)
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationRef.current)
      peel.removeEvents()
      peelRef.current = null
    }
  }, [])

  const animateTo = (target, duration = 220, onComplete) => {
    const peel = peelRef.current
    cancelAnimationFrame(animationRef.current)

    if (!peel) {
      progressRef.current = target
      onComplete?.()
      return
    }

    const start = progressRef.current
    const startedAt = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animationDuration = reducedMotion ? 0 : duration

    const frame = (now) => {
      const elapsed = animationDuration ? (now - startedAt) / animationDuration : 1
      const time = Math.min(elapsed, 1)
      const eased = 1 - ((1 - time) ** 3)
      progressRef.current = start + ((target - start) * eased)
      peel.setTimeAlongPath(progressRef.current)

      if (time < 1) {
        animationRef.current = requestAnimationFrame(frame)
      } else {
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(frame)
  }

  const handleStart = () => {
    if (startingRef.current) return
    startingRef.current = true
    animateTo(1, PEEL_OFF_DURATION, () => {
      window.setTimeout(() => startWithReload(true), START_DELAY)
    })
  }

  return (
    <div
      ref={elementRef}
      className="peel title-page-start"
      onTouchStart={() => {
        if (!startingRef.current) animateTo(HOVER_PEEL)
      }}
      onTouchEnd={() => {
        if (!startingRef.current) animateTo(DEFAULT_PEEL)
      }}
    >
      <div className="peel-bottom title-page-start-bottom" aria-hidden="true" />
      <div className="peel-back title-page-start-back" aria-hidden="true" />
      <div className="peel-top title-page-start-top" aria-hidden="true">Start</div>
      <button
        type="button"
        className="title-page-start-hit-area"
        aria-label="Start"
        draggable="false"
        onClick={handleStart}
      />
    </div>
  )
}

export default function TitlePage() {
  if (!isMobileDevice()) {
    return (
      <div className="title-page">
        <p className="title-page-desktop-message">
          DoomScroller does not work on desktop! Please visit on a mobile device to play.
        </p>
      </div>
    )
  }

  return (
    <div className="title-page">
      <div className="title-page-packaging" aria-hidden="true" />
      <div className="title-page-gold-bar" aria-hidden="true" />
      <div className="title-page-bottom-bar" aria-hidden="true" />
      <div className="title-page-original">Original</div>

      <main className="title-page-content">
        <h1 className="title-page-heading">Phone<span style={{ fontSize: '3.9dvh' }}> </span>Cigarette</h1>
        <p className="title-page-subheading">
          Immersive simulation
          <br />
          of consuming content
        </p>

        <div className="title-page-directions">
          <strong>Directions:</strong>
          <span>Use when craving a dopamine</span>
          <span>hit of scrolling social media.</span>
        </div>

        <PeelableStartButton />
      </main>
    </div>
  )
}
