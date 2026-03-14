import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react'
import type { Question } from '@/types'

interface FeedbackPanelProps {
  question: Question
  selectedChoiceId: string | null
  onRate: (rating: unknown) => void
  isVisible: boolean
}

export function FeedbackPanel({
  question,
  selectedChoiceId,
  isVisible,
}: FeedbackPanelProps) {
  const correctChoice = question.choices.find((c) => c.isCorrect)
  const isCorrect = selectedChoiceId === correctChoice?.id

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-xl mx-auto mt-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg font-medium text-green-500">
                      Correct!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span className="text-lg font-medium text-red-500">
                      Incorrect
                    </span>
                  </>
                )}
              </div>

              {question.explanation && (
                <div className="flex gap-3 mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">
                      Explanation
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                <span>Next question coming up...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
