import Instruction from './Instruction.jsx'

export default function Instructions({ instructions, duration, active }) {
  return instructions.map((instruction) => (
    <Instruction
      key={instruction.type.id}
      type={instruction.type}
      timePercent={instruction.timePercent}
      duration={duration}
      active={active}
    />
  ))
}
