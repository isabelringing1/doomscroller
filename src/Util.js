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

export function generateCaption() {
  const entry = pickRandom(captions)

  const phrase = entry.phrase.replace(/\{(\d+)\}/g, (match, indexStr) => {
    const options = entry.phrase_data[Number(indexStr)]
    return options?.length ? pickRandom(options) : match
  })

  const hashtagCount = Math.floor(Math.random() * 5)
  const hashtags = pickRandomUnique(entry.hashtags ?? [], hashtagCount)
  if (hashtags.length === 0) return phrase

  return `${phrase} ${hashtags.map((tag) => `#${tag}`).join(' ')}`
}

export function generateInstructions(index) {
  const type = instructionTypes[pickInstructionTypeIndex(index, instructionTypes.length)]

  return [
    {
      type,
      timePercent: rollInstructionTimePercent(index, type.time_bounds, type.id),
    },
  ]
}
