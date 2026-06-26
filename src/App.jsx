import { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Page from './Page.jsx'
import Score from './Score.jsx'
import { setIndex, playerAction } from './store.js'

const PAGES_BEFORE = 1
const PAGES_AFTER = 2
const WINDOW = PAGES_BEFORE + 1 + PAGES_AFTER

export default function App() {
  const currentIndex = useSelector((s) => s.feed.currentIndex)
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const ignoreScrollRef = useRef(false)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    ignoreScrollRef.current = true
    el.scrollTop = PAGES_BEFORE * el.clientHeight
    requestAnimationFrame(() => { ignoreScrollRef.current = false })
  }, [currentIndex])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let t
    const sync = () => {
      if (ignoreScrollRef.current) return
      const h = el.clientHeight
      const slot = Math.round(el.scrollTop / h)
      const newIndex = currentIndex + (slot - PAGES_BEFORE)
      if (newIndex !== currentIndex) {
        dispatch(playerAction({
          type: 'scroll',
          direction: newIndex > currentIndex ? 'down' : 'up',
        }))
        dispatch(setIndex(newIndex))
      }
    }
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(sync, 80)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [dispatch, currentIndex])

  return (
    <>
      <Score />
      <div ref={containerRef} className="feed">
        {Array.from({ length: WINDOW }, (_, slot) => (
          <Page
            key={currentIndex - PAGES_BEFORE + slot}
            index={currentIndex - PAGES_BEFORE + slot}
            active={slot === PAGES_BEFORE}
          />
        ))}
      </div>
    </>
  )
}
