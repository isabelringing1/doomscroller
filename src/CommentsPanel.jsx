import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AtSign, Image, ListFilter, Search, Smile, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import Comment from './Comment.jsx'
import CommentsInstructions from './CommentsInstructions.jsx'
import { playerAction, setCommentsScrolling } from './store.js'

const SLIDE_MS = 150
const COMMENT_COUNT = 60
const COMMENTS_SCROLL_END_MS = 80

export default function CommentsPanel({ isOpen, onClose, topBlueText = null }) {
  const dispatch = useDispatch()
  const panelRef = useRef(null)
  const listRef = useRef(null)
  const scrollEndTimerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const comments = useMemo(
    () => Array.from({ length: COMMENT_COUNT }, (_, index) => index),
    [],
  )
  const showSearch = Boolean(topBlueText)

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

  useEffect(() => {
    const list = listRef.current
    if (!list || !isOpen) return

    const onScroll = () => {
      dispatch(setCommentsScrolling(true))
      dispatch(playerAction({ type: 'scroll_comments', phase: 'scroll' }))
      clearTimeout(scrollEndTimerRef.current)
      scrollEndTimerRef.current = setTimeout(() => {
        dispatch(playerAction({ type: 'scroll_comments', phase: 'end' }))
        dispatch(setCommentsScrolling(false))
      }, COMMENTS_SCROLL_END_MS)
    }

    list.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      list.removeEventListener('scroll', onScroll)
      clearTimeout(scrollEndTimerRef.current)
    }
  }, [isOpen, mounted, dispatch])

  const handleClose = () => {
    dispatch(playerAction({ type: 'close_comments' }))
    onClose()
  }

  if (!mounted) return null

  return (
    <div className="comments-overlay">
      <CommentsInstructions />
      <button
        type="button"
        className="comments-dismiss-area"
        onClick={handleClose}
        aria-label="Close comments"
      />
      <div ref={panelRef} className="comments-panel">
        <div className="comments-panel-header">
          {showSearch && (
            <div className="comments-search">
              <span className="comments-search-label">Search: </span>
              <span className="comments-search-query">{topBlueText}</span>
              <Search size={12} className="comments-search-icon" aria-hidden="true" />
            </div>
          )}
          <div className="comments-title-row">
            <div className="comments-title">1,320 comments</div>
            <ListFilter size={18} className="comments-sort-icon" aria-hidden="true" />
            <button type="button" className="comments-close" onClick={handleClose} aria-label="Close comments">
              <X size={22} />
            </button>
          </div>
        </div>

        <div ref={listRef} className="comments-list">
          {comments.map((index) => (
            <Comment key={index} />
          ))}
        </div>

        <div className="comments-input-bar">
          <div className="comments-input-pfp" aria-hidden="true" />
          <div className="comments-input-field">
            <span className="comments-input-placeholder">Add comment...</span>
            <div className="comments-input-actions">
              <Image size={20} aria-hidden="true" />
              <Smile size={20} aria-hidden="true" />
              <AtSign size={20} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
