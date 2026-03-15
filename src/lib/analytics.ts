import { storage } from '@/lib/storage/hybrid'

const ANALYTICS_KEY = 'jadimahir_analytics'

export interface AnalyticsEvent {
  type: string
  timestamp: string
  data: Record<string, unknown>
}

export interface SessionMetrics {
  sessionId: string
  startTime: string
  endTime: string | null
  questionsAnswered: number
  correctAnswers: number
  averageTimePerQuestion: number
  topicId: string
}

export interface DailyMetrics {
  date: string
  sessionsCompleted: number
  totalQuestions: number
  totalCorrect: number
  totalTimeSeconds: number
  uniqueTopics: string[]
}

export interface AnalyticsConsent {
  optedIn: boolean
  optedInAt: string | null
  optedOutAt: string | null
}

let analyticsConsent: AnalyticsConsent = {
  optedIn: false,
  optedInAt: null,
  optedOutAt: null,
}

export function isAnalyticsEnabled(): boolean {
  const stored = storage.get<AnalyticsConsent>('jadimahir_consent')
  if (stored) {
    analyticsConsent = stored
  }
  return analyticsConsent.optedIn
}

export function optInToAnalytics(): void {
  analyticsConsent = {
    optedIn: true,
    optedInAt: new Date().toISOString(),
    optedOutAt: null,
  }
  storage.set('jadimahir_consent', analyticsConsent)
}

export function optOutOfAnalytics(): void {
  analyticsConsent = {
    optedIn: false,
    optedInAt: null,
    optedOutAt: new Date().toISOString(),
  }
  storage.set('jadimahir_consent', analyticsConsent)
}

export function getConsentStatus(): AnalyticsConsent {
  return { ...analyticsConsent }
}

const eventBuffer: AnalyticsEvent[] = []
const MAX_BUFFER_SIZE = 50

function saveEvent(event: AnalyticsEvent): void {
  if (!isAnalyticsEnabled()) return

  eventBuffer.push(event)
  
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    flushEvents()
  }
}

function flushEvents(): void {
  if (eventBuffer.length === 0) return

  const events = [...eventBuffer]
  eventBuffer.length = 0

  const stored = storage.get<AnalyticsEvent[]>(ANALYTICS_KEY) || []
  const updated = [...stored, ...events].slice(-500)
  
  storage.set(ANALYTICS_KEY, updated)
}

export function trackEvent(type: string, data: Record<string, unknown> = {}): void {
  const event: AnalyticsEvent = {
    type,
    timestamp: new Date().toISOString(),
    data,
  }
  
  saveEvent(event)
}

export function trackSessionStart(topicId: string): void {
  trackEvent('session_start', { topicId })
}

export function trackSessionEnd(session: SessionMetrics): void {
  trackEvent('session_end', {
    sessionId: session.sessionId,
    topicId: session.topicId,
    questionsAnswered: session.questionsAnswered,
    correctAnswers: session.correctAnswers,
    averageTimePerQuestion: session.averageTimePerQuestion,
  })
}

export function trackQuestionAnswered(
  questionId: string,
  topicId: string,
  isCorrect: boolean,
  timeSpentMs: number
): void {
  trackEvent('question_answered', {
    questionId,
    topicId,
    isCorrect,
    timeSpentMs,
  })
}

export function trackTopicUnlocked(topicId: string): void {
  trackEvent('topic_unlocked', { topicId })
}

export function trackMasteryLevelUp(topicId: string, newLevel: number): void {
  trackEvent('mastery_level_up', { topicId, newLevel })
}

export function trackExportUsed(): void {
  trackEvent('export_used', {})
}

export function trackImportUsed(): void {
  trackEvent('import_used', {})
}

export function getStoredEvents(): AnalyticsEvent[] {
  return storage.get<AnalyticsEvent[]>(ANALYTICS_KEY) || []
}

export function getEventsByType(type: string): AnalyticsEvent[] {
  return getStoredEvents().filter(e => e.type === type)
}

export function getDailyMetrics(days: number = 7): DailyMetrics[] {
  const events = getStoredEvents()
  const metricsByDate = new Map<string, DailyMetrics>()

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    metricsByDate.set(dateStr, {
      date: dateStr,
      sessionsCompleted: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTimeSeconds: 0,
      uniqueTopics: [],
    })
  }

  const sessionEnds = events.filter(e => e.type === 'session_end')
  
  for (const event of sessionEnds) {
    const date = event.timestamp.split('T')[0]
    const metric = metricsByDate.get(date)
    
    if (metric) {
      metric.sessionsCompleted++
      metric.totalQuestions += (event.data.questionsAnswered as number) || 0
      metric.totalCorrect += (event.data.correctAnswers as number) || 0
      
      const topicId = event.data.topicId as string
      if (topicId && !metric.uniqueTopics.includes(topicId)) {
        metric.uniqueTopics.push(topicId)
      }
    }
  }

  return Array.from(metricsByDate.values()).reverse()
}

export function getAggregatedStats(): {
  totalSessions: number
  totalQuestions: number
  overallAccuracy: number
  averageSessionLength: number
  mostStudiedTopic: string | null
} {
  const events = getStoredEvents()
  const sessionEnds = events.filter(e => e.type === 'session_end')
  
  let totalQuestions = 0
  let totalCorrect = 0
  let totalTime = 0
  const topicCounts = new Map<string, number>()

  for (const event of sessionEnds) {
    totalQuestions += (event.data.questionsAnswered as number) || 0
    totalCorrect += (event.data.correctAnswers as number) || 0
    
    const topicId = event.data.topicId as string
    if (topicId) {
      topicCounts.set(topicId, (topicCounts.get(topicId) || 0) + 1)
    }
  }

  let mostStudied: string | null = null
  let maxCount = 0
  for (const [topic, count] of topicCounts) {
    if (count > maxCount) {
      maxCount = count
      mostStudied = topic
    }
  }

  return {
    totalSessions: sessionEnds.length,
    totalQuestions,
    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    averageSessionLength: sessionEnds.length > 0 ? totalTime / sessionEnds.length : 0,
    mostStudiedTopic: mostStudied,
  }
}

export function clearAnalyticsData(): void {
  storage.remove(ANALYTICS_KEY)
  eventBuffer.length = 0
}
