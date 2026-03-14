const STORAGE_KEY = 'jadimahir_state'

export interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}

class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter()

export function loadState<T>(defaultState: T): T {
  const saved = storage.get<T>(STORAGE_KEY)
  if (saved) {
    return { ...defaultState, ...saved }
  }
  return defaultState
}

export function saveState<T>(state: T): void {
  storage.set(STORAGE_KEY, state)
}

export function clearState(): void {
  storage.remove(STORAGE_KEY)
}
