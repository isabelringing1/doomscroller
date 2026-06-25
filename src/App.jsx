import { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Page from './Page.jsx'
import { next, prev } from './store.js'

export default function App() {
  const currentIndex = useSelector((s) => s.feed.currentIndex)
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const ignoreScrollRef = useRef(false)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    ignoreScrollRef.current = true
    el.scrollTop = el.clientHeight
  }, [currentIndex])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScrollEnd = () => {
      if (ignoreScrollRef.current) {
        ignoreScrollRef.current = false
        return
      }
      const h = el.clientHeight
      const page = Math.round(el.scrollTop / h)
      if (page === 0) dispatch(prev())
      else if (page === 2) dispatch(next())
    }
    el.addEventListener('scrollend', onScrollEnd)
    return () => el.removeEventListener('scrollend', onScrollEnd)
  }, [dispatch])

  return (
    <div ref={containerRef} className="feed">
      <Page index={currentIndex - 1} />
      <Page index={currentIndex} />
      <Page index={currentIndex + 1} />
    </div>
  )
}
