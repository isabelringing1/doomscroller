const STORAGE_KEY = 'doomscroller-high-score'

export function getHighScore() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
}

export function updateHighScore(score) {
  const current = getHighScore()
  if (score <= current) return current
  localStorage.setItem(STORAGE_KEY, String(score))
  return score
}
