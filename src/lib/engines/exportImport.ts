import { storage, clearState } from '@/lib/storage'
import { learnerStore } from '@/store/learnerStore'
import type { LearnerState } from '@/types'

export interface ExportData {
  version: string
  exportedAt: string
  state: LearnerState
}

const EXPORT_VERSION = '1.0.0'

export function exportState(): ExportData {
  const state = learnerStore.get()
  
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  }
}

export function downloadExport(): void {
  const data = exportState()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `jadimahir-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importState(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString) as ExportData
    
    if (!data.version || !data.state) {
      return { success: false, error: 'Invalid backup file format' }
    }
    
    const requiredFields: (keyof LearnerState)[] = ['id', 'xp', 'streak', 'topics', 'cards', 'reviewLogs']
    
    for (const field of requiredFields) {
      if (!(field in data.state)) {
        return { success: false, error: `Missing required field: ${field}` }
      }
    }
    
    storage.set('jadimahir_state', data.state)
    
    window.location.reload()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: `Failed to parse backup: ${error}` }
  }
}

export function uploadBackup(file: File): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const content = e.target?.result as string
      const result = importState(content)
      resolve(result)
    }
    
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' })
    }
    
    reader.readAsText(file)
  })
}

export function validateImport(data: unknown): { valid: boolean; version?: string; error?: string } {
  try {
    const parsed = data as ExportData
    
    if (!parsed.version || !parsed.state) {
      return { valid: false, error: 'Missing version or state' }
    }
    
    if (typeof parsed.state.xp !== 'number' || typeof parsed.state.streak !== 'number') {
      return { valid: false, error: 'Invalid state structure' }
    }
    
    return { valid: true, version: parsed.version }
  } catch {
    return { valid: false, error: 'Invalid JSON structure' }
  }
}

export function mergeState(importedState: Partial<LearnerState>): void {
  const currentState = learnerStore.get()
  
  const merged: LearnerState = {
    ...currentState,
    ...importedState,
    topics: {
      ...currentState.topics,
      ...importedState.topics,
    },
    cards: {
      ...currentState.cards,
      ...importedState.cards,
    },
  }
  
  learnerStore.setState(() => merged)
}

export function resetAllData(): void {
  clearState()
  window.location.reload()
}
