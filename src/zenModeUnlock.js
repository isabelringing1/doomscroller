const STORAGE_KEY = 'doomscroller-zen-mode-unlocked'

let lastGameOverUnlockResult = null

export function isZenModeUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function unlockZenMode() {
  localStorage.setItem(STORAGE_KEY, 'true')
}

export function resolveZenModeUnlock() {
  if (lastGameOverUnlockResult != null) return lastGameOverUnlockResult
  if (isZenModeUnlocked()) return false

  unlockZenMode()
  lastGameOverUnlockResult = true
  return true
}

export function resetZenModeUnlock() {
  lastGameOverUnlockResult = null
}
