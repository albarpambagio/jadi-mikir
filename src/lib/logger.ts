type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
  context?: string
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel = import.meta.env.DEV ? 'debug' : 'warn'

const logs: LogEntry[] = []
const MAX_LOGS = 100

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel as LogLevel]
}

function createLogEntry(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
    context,
  }
}

function addToHistory(entry: LogEntry) {
  logs.push(entry)
  if (logs.length > MAX_LOGS) {
    logs.shift()
  }
}

export const logger = {
  debug(message: string, data?: unknown, context?: string) {
    if (!shouldLog('debug')) return
    const entry = createLogEntry('debug', message, data, context)
    addToHistory(entry)
    console.debug(`[DEBUG${context ? `][${context}]` : ''}] ${message}`, data ?? '')
  },

  info(message: string, data?: unknown, context?: string) {
    if (!shouldLog('info')) return
    const entry = createLogEntry('info', message, data, context)
    addToHistory(entry)
    console.info(`[INFO${context ? `][${context}]` : ''}] ${message}`, data ?? '')
  },

  warn(message: string, data?: unknown, context?: string) {
    if (!shouldLog('warn')) return
    const entry = createLogEntry('warn', message, data, context)
    addToHistory(entry)
    console.warn(`[WARN${context ? `][${context}]` : ''}] ${message}`, data ?? '')
  },

  error(message: string, data?: unknown, context?: string) {
    if (!shouldLog('error')) return
    const entry = createLogEntry('error', message, data, context)
    addToHistory(entry)
    console.error(`[ERROR${context ? `][${context}]` : ''}] ${message}`, data ?? '')
  },

  getHistory(): LogEntry[] {
    return [...logs]
  },

  clearHistory() {
    logs.length = 0
  },
}

export const createContextLogger = (context: string) => ({
  debug(message: string, data?: unknown) {
    logger.debug(message, data, context)
  },
  info(message: string, data?: unknown) {
    logger.info(message, data, context)
  },
  warn(message: string, data?: unknown) {
    logger.warn(message, data, context)
  },
  error(message: string, data?: unknown) {
    logger.error(message, data, context)
  },
})

export type { LogEntry, LogLevel }
