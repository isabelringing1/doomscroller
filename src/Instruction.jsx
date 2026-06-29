import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { instructionVisible } from './store.js'

const FADE_MS = 400

export default function Instruction({ type, timePercent, duration, active, pageIndex }) {
  const dispatch = useDispatch()
  const session = useSelector((s) => s.game.instructionSession)
  const scrollDirection = useSelector((s) => s.feed.scrollDirection)
  const feedback = session?.pageIndex === pageIndex ? session.feedback : null
  const [visible, setVisible] = useState(false)
  const [runId, setRunId] = useState(0)
  const [textLayers, setTextLayers] = useState([])
  const layerIdRef = useRef(0)
  const prevTargetRef = useRef(null)

  const isActiveScrollInstruction =
    (type.id === 'scroll_down' || type.id === 'scroll_up')
    && session?.pageIndex === pageIndex
    && session?.visible
    && session?.status === 'pending'

  const scrollDirectionMatches =
    (type.id === 'scroll_down' && scrollDirection === 'down')
    || (type.id === 'scroll_up' && scrollDirection === 'up')

  const instructionIndex =
    session?.pageIndex === pageIndex ? session.instructionIndex : undefined

  useEffect(() => {
    if (!active) {
      setVisible(false)
      return
    }
    setVisible(false)
    setRunId((id) => id + 1)
  }, [active])

  useEffect(() => {
    if (instructionIndex === undefined) return
    setVisible(false)
    setRunId((id) => id + 1)
  }, [instructionIndex])

  useEffect(() => {
    if (!active) return
    const delayMs = (timePercent / 100) * duration * 1000
    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [active, runId, timePercent, duration])

  useEffect(() => {
    if (!active || !visible) return
    dispatch(instructionVisible({ pageIndex }))
  }, [active, visible, pageIndex, dispatch])

  useEffect(() => {
    if (session?.pageIndex === pageIndex && session.status === 'completed') {
      setVisible(false)
    }
  }, [session?.pageIndex, session?.status, pageIndex])

  const sessionMatchesPage = session?.pageIndex === pageIndex
  const showRealInstruction = visible && sessionMatchesPage && session?.status === 'pending'
  const showWatch = sessionMatchesPage && session && (
    session.status === 'completed' || (session.status === 'pending' && !visible)
  )
  const overlayVisible = showRealInstruction || showWatch
  const targetText = showRealInstruction ? type.display_text : 'Watch'

  useEffect(() => {
    if (!overlayVisible) {
      prevTargetRef.current = null
      setTextLayers([])
      return
    }

    if (prevTargetRef.current === null) {
      prevTargetRef.current = targetText
      layerIdRef.current += 1
      const id = layerIdRef.current
      setTextLayers([{ id, text: targetText, shown: false }])
      requestAnimationFrame(() => {
        setTextLayers((layers) => layers.map((layer) => (
          layer.id === id ? { ...layer, shown: true } : layer
        )))
      })
      return
    }

    if (prevTargetRef.current === targetText) return

    prevTargetRef.current = targetText
    layerIdRef.current += 1
    const id = layerIdRef.current

    setTextLayers((layers) => [
      ...layers.map((layer) => ({ ...layer, shown: false })),
      { id, text: targetText, shown: false },
    ])

    const showTimer = requestAnimationFrame(() => {
      setTextLayers((layers) => layers.map((layer) => (
        layer.id === id ? { ...layer, shown: true } : layer
      )))
    })

    const removeTimer = setTimeout(() => {
      setTextLayers((layers) => layers.filter((layer) => layer.id === id))
    }, FADE_MS)

    return () => {
      cancelAnimationFrame(showTimer)
      clearTimeout(removeTimer)
    }
  }, [overlayVisible, targetText])

  if (!active) return null

  const topLayerId = textLayers.at(-1)?.id

  const feedbackClass = showRealInstruction && scrollDirectionMatches && isActiveScrollInstruction
    ? ' instruction-text--success'
    : showRealInstruction && feedback === 'success'
      ? ' instruction-text--success'
      : ''

  return (
    <div className={`instruction-overlay${overlayVisible ? ' instruction-overlay--visible' : ''}`}>
      <div className="instruction-text-stack">
        {textLayers.map((layer) => (
          <span
            key={layer.id}
            className={`instruction-text${layer.id === topLayerId ? feedbackClass : ''}${layer.shown ? ' instruction-text--shown' : ''}`}
          >
            {layer.text}
          </span>
        ))}
      </div>
    </div>
  )
}
