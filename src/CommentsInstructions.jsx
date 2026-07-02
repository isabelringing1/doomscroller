import { useSelector } from 'react-redux'
import Instruction from './Instruction.jsx'

export default function CommentsInstructions() {
  const commentsOpen = useSelector((s) => s.game.commentsOpen)
  const currentIndex = useSelector((s) => s.feed.currentIndex)
  const session = useSelector((s) => s.game.instructionSession)

  if (!commentsOpen || !session || session.pageIndex !== currentIndex) return null

  const hasOverlayInstructions = session.instructions.some(
    (instruction) => instruction.type.comments_overlay,
  )
  if (!hasOverlayInstructions) return null

  return (
    <div className="comments-instructions-layer">
      {session.instructions.map((instruction, instructionIndex) => {
        if (!instruction.type.comments_overlay) return null

        return (
          <Instruction
            key={`${currentIndex}-${instruction.type.id}-${instructionIndex}`}
            type={instruction.type}
            timeMs={instruction.timeMs}
            timeLimit={instruction.timeLimit}
            active
            pageIndex={currentIndex}
            instructionIndex={instructionIndex}
            position={instruction.type.position}
          />
        )
      })}
    </div>
  )
}
