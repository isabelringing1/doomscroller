import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import PageMenu from './PageMenu.jsx'
import PageDuration from './PageDuration.jsx'
import Instructions from './Instructions.jsx'
import { generateInstructions } from './Util.js'
import { durationForIndex } from './pageMeta.js'
import { instructionPageActive } from './store.js'

export default function Page({ index, active }) {
  const dispatch = useDispatch()
  const instructions = useMemo(() => generateInstructions(index), [index])
  const duration = useMemo(() => durationForIndex(index), [index])

  useEffect(() => {
    if (!active) return
    dispatch(instructionPageActive({ pageIndex: index, instruction: instructions[0] }))
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
      <PageDuration index={index} active={active} />
    </div>
  )
}
