const DB_NAME = 'jadimahir_db'
const DB_VERSION = 1
const STORE_NAME = 'learner_state'

interface DBSchema {
  learner_state: LearnerStateData
}

interface LearnerStateData {
  key: string
  data: unknown
  updatedAt: string
}

let db: IDBDatabase | null = null

export async function openDatabase(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
  })
}

export async function getFromIndexedDB<T>(key: string): Promise<T | null> {
  try {
    const database = await openDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onerror = () => reject(null)
      request.onsuccess = () => {
        const result = request.result as LearnerStateData | undefined
        resolve(result ? (result.data as T) : null)
      }
    })
  } catch {
    return null
  }
}

export async function setInIndexedDB<T>(key: string, data: T): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const record: LearnerStateData = {
      key,
      data,
      updatedAt: new Date().toISOString(),
    }
    
    const request = store.put(record)

    request.onerror = () => reject(new Error('Failed to save to IndexedDB'))
    request.onsuccess = () => resolve()
  })
}

export async function deleteFromIndexedDB(key: string): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(key)

    request.onerror = () => reject(new Error('Failed to delete from IndexedDB'))
    request.onsuccess = () => resolve()
  })
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    }
  }
  return { usage: 0, quota: 0 }
}

export async function shouldUseIndexedDB(): Promise<boolean> {
  const { usage, quota } = await getStorageEstimate()
  
  const LOCAL_STORAGE_LIMIT = 5 * 1024 * 1024
  
  if (quota > 0 && usage > LOCAL_STORAGE_LIMIT) {
    return true
  }
  
  try {
    const testData = new Array(1000).fill('x').join('')
    localStorage.setItem('storage_test', testData)
    localStorage.removeItem('storage_test')
    return false
  } catch {
    return true
  }
}

export async function migrateToIndexedDB(localState: unknown): Promise<boolean> {
  try {
    await setInIndexedDB('learner_state', localState)
    
    const migrated = await getFromIndexedDB('learner_state')
    return migrated !== null
  } catch {
    return false
  }
}

export async function migrateFromIndexedDB(): Promise<unknown | null> {
  return getFromIndexedDB('learner_state')
}

export async function clearIndexedDB(): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onerror = () => reject(new Error('Failed to clear IndexedDB'))
    request.onsuccess = () => resolve()
  })
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    db.close()
    db = null
  }
}
