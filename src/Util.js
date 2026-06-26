import instructionTypes from './Instructions.json'
import { pickInstructionTypeIndex, rollInstructionTimePercent } from './pageMeta.js'

export function generateInstructions(index) {
  const type = instructionTypes[pickInstructionTypeIndex(index, instructionTypes.length)]

  return [
    {
      type,
      timePercent: rollInstructionTimePercent(index, type.time_bounds, type.id),
    },
  ]
}
