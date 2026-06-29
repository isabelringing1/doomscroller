export const MIN_PAGE_INDEX = 0

export function timeScalarForIndex(index) {
  return Math.max(0, 1 - 0.05 * Math.floor(index / 3))
}

export function durationForIndex(index, generation = 0) {
  const t = Math.abs(Math.sin((index + 1 + generation * 997) * 12.9898) * 43758.5453) % 1
  return 10;
  return 5 + t * 10
}

function stableUnit(index, salt, generation = 0) {
  const seed = `${generation}:${index}:${salt}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return Math.abs(Math.sin(hash * 12.9898) * 43758.5453) % 1
}

export function rollInstructionTimePercent(index, timeBounds, salt, generation = 0) {
  const [min, max] = timeBounds
  return min + stableUnit(index, salt, generation) * (max - min)
}

export function pickInstructionTypeIndex(index, typeCount, generation = 0) {
  return Math.floor(stableUnit(index, 'instruction-type', generation) * typeCount)
}
