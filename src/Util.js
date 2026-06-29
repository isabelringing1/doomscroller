import instructionTypes from './Instructions.json'
import captions from './captions.json'
import { pickInstructionTypeIndex, rollInstructionTimePercent } from './pageMeta.js'

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

  return { phrase, hashtags }
}

export function generateInstructions(index, generation = 0) {
  const type = instructionTypes[pickInstructionTypeIndex(index, instructionTypes.length, generation)]

  var instructions = [
    {
      type,
      timePercent: rollInstructionTimePercent(index, type.time_bounds, type.id, generation),
    },
  ]

  if (type.id !== 'scroll_down') {
    const scrollDownType = instructionTypes.find((t) => t.id === 'scroll_down')
    instructions.push({
      type: scrollDownType,
      timePercent: rollInstructionTimePercent(index, scrollDownType.time_bounds, 'scroll_down', generation),
    })
  }

  return instructions
}
