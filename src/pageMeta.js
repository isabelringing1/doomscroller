export function durationForIndex(index) {
  const t = Math.abs(Math.sin((index + 1) * 12.9898) * 43758.5453) % 1
  return 5 + t * 10
}

function stableUnit(index, salt) {
  const seed = `${index}:${salt}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return Math.abs(Math.sin(hash * 12.9898) * 43758.5453) % 1
}

export function rollInstructionTimePercent(index, timeBounds, salt) {
  const [min, max] = timeBounds
  return min + stableUnit(index, salt) * (max - min)
}

export function pickInstructionTypeIndex(index, typeCount) {
  return Math.floor(stableUnit(index, 'instruction-type') * typeCount)
}
