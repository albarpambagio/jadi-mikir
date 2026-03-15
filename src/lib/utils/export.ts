import type { Topic, LearnerState } from '@/types'

export interface ExportData {
  topics: Topic[]
  learnerState: LearnerState
  exportDate: string
  version: string
}

export async function exportToCSV(data: ExportData): Promise<void> {
  const rows = [
    // Header
    ['ID', 'Title', 'Subject', 'Difficulty', 'Question Count', 'Mastered', 'Last Practiced'].join(','),
    // Topics data
    ...data.topics.map(topic => {
      const mastery = data.learnerState.topics[topic.id]
      const mastered = mastery ? mastery.masteredQuestions : 0
      const lastPracticed = mastery?.lastPracticed || ''
      return [
        topic.id,
        `"${topic.title}"`,
        topic.subject,
        topic.difficulty,
        topic.questionCount.toString(),
        mastered.toString(),
        lastPracticed
      ].join(',')
    }),
  ]

  const csvContent = rows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `jadimikir-topics-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportToJSON(data: ExportData): Promise<void> {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `jadimikir-backup-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportToPDF(_data: ExportData): Promise<void> {
  // PDF export disabled - placeholder for future implementation
  console.warn('PDF export is not yet implemented')
  throw new Error('PDF export is not available')
}

export async function downloadExport(format: 'csv' | 'json' | 'pdf', data: ExportData): Promise<void> {
  switch (format) {
    case 'csv':
      await exportToCSV(data)
      break
    case 'json':
      await exportToJSON(data)
      break
    case 'pdf':
      await exportToPDF(data)
      break
    default:
      throw new Error(`Unknown export format: ${format}`)
  }
}
