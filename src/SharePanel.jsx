import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import ShareComponent from './ShareComponent.jsx'
import ShareInstructions from './ShareInstructions.jsx'
import { getSendPostTargetIndex } from './Util.js'
import { playerAction } from './store.js'

const SLIDE_MS = 150
const SHARE_COUNT = 20
const ROW_COUNT = 3

export default function SharePanel({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const currentIndex = useSelector((s) => s.feed.currentIndex)
  const session = useSelector((s) => s.game.instructionSession)
  const panelRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const rows = useMemo(
    () =>
      Array.from({ length: ROW_COUNT }, (_, rowIndex) =>
        Array.from({ length: SHARE_COUNT }, (_, itemIndex) => `${rowIndex}-${itemIndex}`),
      ),
    [],
  )

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      return
    }

    const timer = setTimeout(() => setMounted(false), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [isOpen])

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || !mounted) return

    if (isOpen) {
      panel.style.transition = 'none'
      panel.style.transform = 'translateY(100%)'
      panel.getBoundingClientRect()
      panel.style.transition = `transform ${SLIDE_MS}ms ease`
      panel.style.transform = 'translateY(0)'
      return
    }

    panel.style.transition = `transform ${SLIDE_MS}ms ease`
    panel.style.transform = 'translateY(100%)'
  }, [isOpen, mounted])

  const handleClose = () => {
    dispatch(playerAction({ type: 'close_share' }))
    onClose()
  }

  const highlightedShareIndex = session?.pageIndex === currentIndex
    ? getSendPostTargetIndex(session)
    : null

  const onShareComponentClick = (itemIndex) => {
    dispatch(playerAction({ type: 'send_post', index: itemIndex }))
  }

  if (!mounted) return null

  return (
    <div className="share-overlay">
      <ShareInstructions />
      <button
        type="button"
        className="share-dismiss-area"
        onClick={handleClose}
        aria-label="Close share menu"
      />
      <div ref={panelRef} className="share-panel">
        <div className="share-panel-header">
          <Search size={22} className="share-search-icon" aria-hidden="true" />
          <div className="share-title" aria-hidden="true" />
          <button type="button" className="share-close" onClick={handleClose} aria-label="Close share menu">
            <X size={22} />
          </button>
        </div>

        <div className="share-rows">
          {rows.map((items, rowIndex) => (
            <div key={rowIndex} className={`share-row${rowIndex === 1 ? ' share-row--bordered' : ''}`}>
              <div className="share-row-scroll">
                {items.map((key, itemIndex) => (
                  <ShareComponent
                    key={key}
                    highlighted={rowIndex === 0 && itemIndex === highlightedShareIndex}
                    onClick={rowIndex === 0 ? () => onShareComponentClick(itemIndex) : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
