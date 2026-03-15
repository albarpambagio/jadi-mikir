import { useMemo, useState, useEffect } from 'react'
import type { Choice, Question } from '@/types'

export interface RandomizedChoice extends Choice {
  displayIndex: number
}

export interface RandomizedQuestion extends Omit<Question, 'choices'> {
  choices: RandomizedChoice[]
}

function shuffleChoices<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function useChoiceRandomization(question: Question | null): RandomizedQuestion | null {
  const [seed] = useState(() => Math.random())

  return useMemo(() => {
    if (!question) return null

    const shuffled = shuffleChoices(question.choices)
    const randomizedChoices: RandomizedChoice[] = shuffled.map((choice, index) => ({
      ...choice,
      displayIndex: index,
    }))

    return {
      ...question,
      choices: randomizedChoices,
    }
  }, [question, seed])
}

export function useShuffledChoices(choices: Choice[]): RandomizedChoice[] {
  const [seed] = useState(() => Math.random())

  return useMemo(() => {
    const shuffled = shuffleChoices(choices)
    return shuffled.map((choice, index) => ({
      ...choice,
      displayIndex: index,
    }))
  }, [choices, seed])
}

export function getDisplayLetter(index: number): string {
  return String.fromCharCode(65 + index)
}
