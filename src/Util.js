import instructionTypes from './Instructions.json'
import captions from './captions.json'
import { pickInstructionTypeIndex, rollInstructionTimePercent } from './pageMeta.js'

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

export function generateInstructions(index, generation = 0) {
  const type = actionableTypes[pickInstructionTypeIndex(index, actionableTypes.length, generation)]

  const instructions = [
    {
      type: unjudgeableType,
      timePercent: rollInstructionTimePercent(index, unjudgeableType.time_bounds, unjudgeableType.id, generation),
    },
    {
      type,
      timePercent: rollInstructionTimePercent(index, type.time_bounds, type.id, generation),
    },
  ]

  if (type.id !== 'scroll_down') {
    instructions.push({
      type: scrollDownType,
      timePercent: rollInstructionTimePercent(index, scrollDownType.time_bounds, 'scroll_down', generation),
    })
  }

  return instructions
}
