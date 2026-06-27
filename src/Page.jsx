import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageMenu from './PageMenu.jsx'
import PageDuration from './PageDuration.jsx'
import Instructions from './Instructions.jsx'
import { generateInstructions } from './Util.js'
import { durationForIndex } from './pageMeta.js'
import { instructionPageActive } from './store.js'

export default function Page({ index, active }) {
  const dispatch = useDispatch()
  const failureOverlay = useSelector((s) => s.game.instructionFailureOverlay)
  const instructions = useMemo(() => generateInstructions(index), [index])
  const duration = useMemo(() => durationForIndex(index), [index])
  const showFailureOverlay = failureOverlay?.pageIndex === index

  useEffect(() => {
    if (!active) return
    dispatch(instructionPageActive({ pageIndex: index, instructions }))
  }, [active, index, instructions, dispatch])

  return (
    <div className="page" data-active={active || undefined}>
      <PageMenu index={index} active={active} />
      <Instructions
        instructions={instructions}
        duration={duration}
        active={active}
        pageIndex={index}
      />
      {showFailureOverlay && (
        <div className="instruction-overlay instruction-overlay--visible instruction-overlay--feedback">
          <span className="instruction-text instruction-text--failure">{failureOverlay.displayText}</span>
        </div>
      )}
      <PageDuration index={index} active={active} />
    </div>
  )
}
