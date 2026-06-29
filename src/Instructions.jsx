import { useSelector } from 'react-redux'
import Instruction from './Instruction.jsx'

export default function Instructions({ instructions, duration, active, pageIndex }) {
  const session = useSelector((s) => s.game.instructionSession)
  const instructionIndex = session?.pageIndex === pageIndex ? session.instructionIndex : 0
  const instruction = instructions[instructionIndex]

  if (!instruction) return null

  return (
    <Instruction
      key={pageIndex}
      type={instruction.type}
      timePercent={instruction.timePercent}
      duration={duration}
      active={active}
      pageIndex={pageIndex}
    />
  )
}
