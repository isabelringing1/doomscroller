import { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Page from './Page.jsx'
import Score from './Score.jsx'
import GameOver from './GameOver.jsx'
import TitlePage from './TitlePage.jsx'
import { dismissTitle, beginGameplay, setIndex, setScrollDirection, playerAction, store } from './store.js'
import { MIN_PAGE_INDEX } from './pageMeta.js'

const PAGES_BEFORE = 1
const PAGES_AFTER = 2
const WINDOW = PAGES_BEFORE + 1 + PAGES_AFTER

export default function App() {
  const currentIndex = useSelector((s) => s.feed.currentIndex)
  const feedGeneration = useSelector((s) => s.feed.feedGeneration)
  const gameStarted = useSelector((s) => s.game.gameStarted)
  const titleDismissed = useSelector((s) => s.feed.titleDismissed)
  const health = useSelector((s) => s.game.health)
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const ignoreScrollRef = useRef(false)
  const lastScrollTopRef = useRef(null)

  useEffect(() => {
    if (!gameStarted || titleDismissed) return

    const el = containerRef.current
    if (!el) return

    ignoreScrollRef.current = true
    el.scrollTo({ top: el.clientHeight, behavior: 'smooth' })

    let done = false
    const finish = () => {
      if (done) return
      done = true
      dispatch(dismissTitle())
      dispatch(beginGameplay())
      ignoreScrollRef.current = false
    }

    const interval = setInterval(() => {
      if (Math.abs(el.scrollTop - el.clientHeight) < 2) finish()
    }, 50)
    const timeout = setTimeout(finish, 800)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [gameStarted, titleDismissed, dispatch])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    ignoreScrollRef.current = true

    if (titleDismissed) {
      el.scrollTop = PAGES_BEFORE * el.clientHeight
      lastScrollTopRef.current = el.scrollTop
    } else {
      el.scrollTop = 0
      lastScrollTopRef.current = 0
    }

    dispatch(setScrollDirection(null))
    requestAnimationFrame(() => { ignoreScrollRef.current = false })
  }, [currentIndex, titleDismissed, dispatch])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let t

    const sync = () => {
      if (ignoreScrollRef.current || !titleDismissed) return
      const h = el.clientHeight
      const slot = Math.round(el.scrollTop / h)
      const rawIndex = currentIndex + (slot - PAGES_BEFORE)
      const newIndex = Math.max(MIN_PAGE_INDEX, rawIndex)

      if (rawIndex < currentIndex && newIndex === currentIndex) {
        ignoreScrollRef.current = true
        el.scrollTop = PAGES_BEFORE * h
        lastScrollTopRef.current = el.scrollTop
        dispatch(playerAction({ type: 'scroll', direction: 'up' }))
        requestAnimationFrame(() => { ignoreScrollRef.current = false })
        return
      }

      if (newIndex !== currentIndex) {
        dispatch(playerAction({
          type: 'scroll',
          direction: newIndex > currentIndex ? 'down' : 'up',
          pendingIndex: newIndex,
        }))
        const hasFeedback = store.getState().game.instructionSession?.states?.some((s) => s.feedback)
        if (!hasFeedback) {
          dispatch(setIndex(newIndex))
        }
      }
    }

    const onScroll = () => {
      if (ignoreScrollRef.current) return

      if (!gameStarted) {
        if (el.scrollTop !== 0) el.scrollTop = 0
        return
      }

      if (!titleDismissed) return

      const h = el.clientHeight
      const minScrollTop = PAGES_BEFORE * h
      if (currentIndex <= MIN_PAGE_INDEX && el.scrollTop < minScrollTop) {
        el.scrollTop = minScrollTop
        lastScrollTopRef.current = minScrollTop
        return
      }

      const scrollTop = el.scrollTop
      if (lastScrollTopRef.current !== null && scrollTop !== lastScrollTopRef.current) {
        dispatch(setScrollDirection(scrollTop > lastScrollTopRef.current ? 'down' : 'up'))
      }
      lastScrollTopRef.current = scrollTop

      clearTimeout(t)
      t = setTimeout(() => {
        dispatch(setScrollDirection(null))
        sync()
      }, 80)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [dispatch, currentIndex, gameStarted, titleDismissed])

  return (
    <>
      {titleDismissed && <Score />}
      {titleDismissed && health <= 0 && <GameOver />}
      <div
        ref={containerRef}
        className={`feed${!gameStarted ? ' feed--title' : ''}`}
      >
        {!titleDismissed && <TitlePage />}
        {gameStarted && !titleDismissed && <div className="page page--placeholder" aria-hidden="true" />}
        {gameStarted && titleDismissed && Array.from({ length: WINDOW }, (_, slot) => (
          <Page
            key={`${feedGeneration}-${currentIndex - PAGES_BEFORE + slot}`}
            index={currentIndex - PAGES_BEFORE + slot}
            active={slot === PAGES_BEFORE}
          />
        ))}
      </div>
    </>
  )
}
