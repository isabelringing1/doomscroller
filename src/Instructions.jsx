import Instruction from './Instruction.jsx'

export default function Instructions({ instructions, active, pageIndex }) {
  return (
    <div className="instructions-layer">
      {instructions.map((instruction, instructionIndex) => (
        <Instruction
          key={`${pageIndex}-${instruction.type.id}-${instructionIndex}`}
          type={instruction.type}
          timeMs={instruction.timeMs}
          timeLimit={instruction.timeLimit}
          active={active}
          pageIndex={pageIndex}
          instructionIndex={instructionIndex}
          position={instruction.type.position}
        />
      ))}
    </div>
  )
}
