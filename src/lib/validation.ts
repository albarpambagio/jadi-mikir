import { TopicSchema } from '../types'
import { QuestionSchema } from '../types'
import type { Question, Topic } from '../types'

export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult<T> {
  valid: boolean
  data?: T
  errors: ValidationError[]
}

export class ContentValidator {
  static validateTopic(data: unknown): ValidationResult<Topic> {
    const result = TopicSchema.safeParse(data)
    
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
          severity: 'error',
        })),
      }
    }
    
    return {
      valid: true,
      data: result.data,
      errors: [],
    }
  }

  static validateQuestion(data: unknown): ValidationResult<Question> {
    const result = QuestionSchema.safeParse(data)
    
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
          severity: 'error',
        })),
      }
    }
    
    const questionErrors: ValidationError[] = []
    
    const correctChoices = result.data.choices.filter((c: any) => c.isCorrect)
    if (correctChoices.length === 0) {
      questionErrors.push({
        path: 'choices',
        message: 'Question must have at least one correct answer',
        severity: 'error',
      })
    }
    
    if (correctChoices.length > 1) {
      questionErrors.push({
        path: 'choices',
        message: 'Question has multiple correct answers - consider using single-answer format',
        severity: 'warning',
      })
    }
    
    const choiceIds = result.data.choices.map((c: any) => c.id)
    if (new Set(choiceIds).size !== choiceIds.length) {
      questionErrors.push({
        path: 'choices',
        message: 'Choice IDs must be unique',
        severity: 'error',
      })
    }
    
    if (!result.data.explanation || result.data.explanation.trim().length === 0) {
      questionErrors.push({
        path: 'explanation',
        message: 'Question should have an explanation for learning',
        severity: 'warning',
      })
    }
    
    return {
      valid: questionErrors.filter((e) => e.severity === 'error').length === 0,
      data: result.data,
      errors: questionErrors,
    }
  }

  static validateQuestions(questions: unknown[]): { valid: boolean; errors: ValidationError[]; validCount: number } {
    const allErrors: ValidationError[] = []
    let validCount = 0
    
    questions.forEach((q, index) => {
      const result = this.validateQuestion(q)
      if (result.valid) {
        validCount++
      } else {
        allErrors.push(...result.errors.map((e) => ({
          ...e,
          path: `[${index}] ${e.path}`,
        })))
      }
    })
    
    return {
      valid: allErrors.filter((e) => e.severity === 'error').length === 0,
      errors: allErrors,
      validCount,
    }
  }

  static validateTopicQuestions(topic: Topic, questions: Question[]): ValidationError[] {
    const errors: ValidationError[] = []
    
    const topicQuestions = questions.filter((q) => q.topicId === topic.id)
    
    if (topicQuestions.length < topic.questionCount) {
      errors.push({
        path: 'questions',
        message: `Topic expects ${topic.questionCount} questions but has ${topicQuestions.length}`,
        severity: 'warning',
      })
    }
    
    if (topicQuestions.length === 0) {
      errors.push({
        path: 'questions',
        message: `Topic ${topic.id} has no questions`,
        severity: 'error',
      })
    }
    
    return errors
  }
}

export const validateContent = {
  topic: ContentValidator.validateTopic,
  question: ContentValidator.validateQuestion,
  questions: ContentValidator.validateQuestions,
  topicQuestions: ContentValidator.validateTopicQuestions,
}
