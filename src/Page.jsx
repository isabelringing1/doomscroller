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
  const feedGeneration = useSelector((s) => s.feed.feedGeneration)
  const zenMode = useSelector((s) => s.game.zenMode)
  const instructions = useMemo(
    () => generateInstructions(index, feedGeneration, zenMode),
    [index, feedGeneration, zenMode],
  )
  const duration = useMemo(
    () => durationForIndex(index, feedGeneration),
    [index, feedGeneration],
  )

  useEffect(() => {
    if (!active) return
    dispatch(instructionPageActive({ pageIndex: index, instructions }))
  }, [active, index, instructions, dispatch])

  return (
    <div className="page" data-active={active || undefined}>
      <PageMenu index={index} active={active} />
      <Instructions
        instructions={instructions}
        active={active}
        pageIndex={index}
      />
      <PageDuration active={active} duration={duration} />
    </div>
  )
}
