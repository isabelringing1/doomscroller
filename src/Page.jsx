import { useMemo } from 'react'
import PageMenu from './PageMenu.jsx'
import PageDuration from './PageDuration.jsx'
import Instructions from './Instructions.jsx'
import { generateInstructions } from './generateInstructions.js'
import { durationForIndex } from './pageMeta.js'

export default function Page({ index, active }) {
  const instructions = useMemo(() => generateInstructions(index), [index])
  const duration = useMemo(() => durationForIndex(index), [index])

  return (
    <div className="page" data-active={active || undefined}>
      <PageMenu index={index} />
      <Instructions instructions={instructions} duration={duration} active={active} />
      <PageDuration index={index} active={active} />
    </div>
  )
}
