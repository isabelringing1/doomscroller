import instructionTypes from './Instructions.json'
import captions from './captions.json'
import { pickInstructionTypeIndex, rollInstructionDuration, rollInstructionTimeMs, timeScalarForIndex } from './pageMeta.js'

export const DEBUG_INSTRUCTIONS = ['watch', 'speed_up', 'scroll_down']

const instructionTypeById = Object.fromEntries(instructionTypes.map((type) => [type.id, type]))
const actionableTypes = instructionTypes.filter((t) => !t.unjudgeable)
const unjudgeableType = instructionTypes.find((t) => t.unjudgeable)
const scrollDownType = instructionTypes.find((t) => t.id === 'scroll_down')

export function anchorAlign(anchor) {
  if (anchor === 'center left') return 'left'
  if (anchor === 'center right') return 'right'
  return 'center'
}

export function isInstructionBlocked(session, instructionIndex) {
  if (!session || instructionIndex === 0) return false
  const prior = session.instructions[instructionIndex - 1]
  const priorState = session.states[instructionIndex - 1]
  return prior.type.blocking === true && priorState.status !== 'completed'
}

function pickRandom(options) {
  return options[Math.floor(Math.random() * options.length)]
}

function pickRandomUnique(options, count) {
  const pool = [...options]
  const picked = []

  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(index, 1)[0])
  }

  return picked
}

export function formatGameDuration(ms) {
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const minuteLabel = minutes === 1 ? 'minute' : 'minutes'
  const secondLabel = seconds === 1 ? 'second' : 'seconds'
  if (minutes > 0) {
    return `${minutes} ${minuteLabel} ${seconds} ${secondLabel}`
  }
  return `${seconds} ${secondLabel}`
}

export function generateCaption() {
  const entry = pickRandom(captions)

  const phrase = entry.phrase.replace(/\{(\d+)\}/g, (match, indexStr) => {
    const options = entry.phrase_data[Number(indexStr)]
    return options?.length ? pickRandom(options) : match
  })

  const hashtagCount = Math.floor(Math.random() * 5)
  const hashtags = pickRandomUnique(entry.hashtags ?? [], hashtagCount)

  if (!hashtags.includes('fyp') && Math.random() < 0.75) {
    hashtags.unshift('fyp')
  }

  return { phrase, hashtags }
}

export function generateInstructions(index, generation = 0, zenMode = false) {
  const scalar = zenMode ? 1 : timeScalarForIndex(index)

  const buildInstruction = (instructionType, salt, timeBounds) => {
    const holdDurationMs = instructionType.duration_bounds
      ? rollInstructionDuration(index, instructionType.duration_bounds, salt, generation)
      : undefined
    const baseTimeLimit = instructionType.time_limit != null ? instructionType.time_limit * scalar : undefined

    return {
      type: instructionType,
      timeMs: rollInstructionTimeMs(index, timeBounds, salt, generation) * scalar,
      timeLimit: baseTimeLimit != null && holdDurationMs != null
        ? Math.max(baseTimeLimit, holdDurationMs + 500)
        : baseTimeLimit,
      holdDurationMs,
    }
  }

  if (DEBUG_INSTRUCTIONS.length > 0) {
    return DEBUG_INSTRUCTIONS.map((id) => {
      const instructionType = instructionTypeById[id]
      return buildInstruction(instructionType, id, instructionType.time_bounds)
    })
  }

  const type = actionableTypes[pickInstructionTypeIndex(index, actionableTypes.length, generation)]

  const instructions = [
    buildInstruction(unjudgeableType, unjudgeableType.id, unjudgeableType.time_bounds),
    buildInstruction(type, type.id, type.time_bounds),
  ]

  if (type.id !== 'scroll_down') {
    instructions.push(
      buildInstruction(scrollDownType, 'scroll_down', scrollDownType.time_bounds),
    )
  }

  return instructions
}
