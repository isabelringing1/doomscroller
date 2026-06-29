const STORAGE_KEY = 'doomscroller-high-score'

let lastGameOverResult = null

export function getHighScore() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
}

export function resolveGameOverHighScore(score) {
  if (lastGameOverResult?.score === score) {
    return lastGameOverResult.isNew
  }

  const isNew = score > getHighScore()
  if (isNew) {
    localStorage.setItem(STORAGE_KEY, String(score))
  }

  lastGameOverResult = { score, isNew }
  return isNew
}

export function resetGameOverHighScore() {
  lastGameOverResult = null
}
