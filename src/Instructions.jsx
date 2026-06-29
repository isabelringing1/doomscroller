import Instruction from './Instruction.jsx'

export default function Instructions({ instructions, duration, active, pageIndex }) {
  return (
    <div className="instructions-layer">
      {instructions.map((instruction, instructionIndex) => (
        <Instruction
          key={`${pageIndex}-${instruction.type.id}-${instructionIndex}`}
          type={instruction.type}
          timePercent={instruction.timePercent}
          timeLimit={instruction.timeLimit}
          duration={duration}
          active={active}
          pageIndex={pageIndex}
          instructionIndex={instructionIndex}
          position={instruction.type.position}
        />
      ))}
    </div>
  )
}
