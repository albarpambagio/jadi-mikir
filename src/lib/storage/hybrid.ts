import { getFromIndexedDB, setInIndexedDB, shouldUseIndexedDB, migrateToIndexedDB, migrateFromIndexedDB } from './indexedDB'

const STORAGE_KEY = 'jadimahir_state'

type StorageBackend = 'localStorage' | 'indexedDB'

interface StorageAdapter {
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

class IndexedDBStorage {
  private pendingWrites: Map<string, unknown> = new Map()
  private flushTimeout: ReturnType<typeof setTimeout> | null = null

  async get<T>(key: string): Promise<T | null> {
    return getFromIndexedDB<T>(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.pendingWrites.set(key, value)
    
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout)
    }
    
    this.flushTimeout = setTimeout(() => {
      this.flush()
    }, 100)
  }

  private async flush(): Promise<void> {
    for (const [key, value] of this.pendingWrites) {
      await setInIndexedDB(key, value)
    }
    this.pendingWrites.clear()
  }

  delete(key: string): void {
    this.pendingWrites.delete(key)
  }
}

class HybridStorageAdapter implements StorageAdapter {
  private local = new LocalStorageAdapter()
  private indexedDB = new IndexedDBStorage()
  private useIndexedDB = false

  async init(): Promise<void> {
    this.useIndexedDB = await shouldUseIndexedDB()
    
    if (!this.useIndexedDB) {
      const localData = this.local.get(STORAGE_KEY)
      if (localData) {
        const jsonSize = JSON.stringify(localData).length
        if (jsonSize > 2 * 1024 * 1024) {
          this.useIndexedDB = true
          await migrateToIndexedDB(localData)
        }
      }
    }
  }

  get<T>(key: string): T | null {
    if (this.useIndexedDB) {
      console.warn('Synchronous get called on async IndexedDB adapter')
      return null
    }
    return this.local.get<T>(key)
  }

  async getAsync<T>(key: string): Promise<T | null> {
    if (this.useIndexedDB) {
      return this.indexedDB.get<T>(key)
    }
    return this.local.get<T>(key)
  }

  set<T>(key: string, value: T): void {
    if (this.useIndexedDB) {
      this.indexedDB.set(key, value)
    } else {
      this.local.set(key, value)
    }
  }

  remove(key: string): void {
    if (this.useIndexedDB) {
      this.indexedDB.delete(key)
    } else {
      this.local.remove(key)
    }
  }

  isUsingIndexedDB(): boolean {
    return this.useIndexedDB
  }
}

export const hybridStorage = new HybridStorageAdapter()

export const storage: StorageAdapter = {
  get<T>(key: string): T | null {
    return hybridStorage.get<T>(key)
  },
  set<T>(key: string, value: T): void {
    hybridStorage.set(key, value)
  },
  remove(key: string): void {
    hybridStorage.remove(key)
  },
}

export async function initStorage(): Promise<void> {
  await hybridStorage.init()
}

export function loadState<T>(defaultState: T): T {
  const saved = storage.get<T>(STORAGE_KEY)
  if (saved) {
    return { ...defaultState, ...saved }
  }
  return defaultState
}

export function loadStateAsync<T>(defaultState: T): Promise<T> {
  return hybridStorage.getAsync<T>(STORAGE_KEY).then(saved => {
    if (saved) {
      return { ...defaultState, ...saved }
    }
    return defaultState
  })
}

export function saveState<T>(state: T): void {
  storage.set(STORAGE_KEY, state)
}

export function clearState(): void {
  storage.remove(STORAGE_KEY)
}
