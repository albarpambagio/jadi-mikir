import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import type { Question as QuestionType, Rating } from '@/types'

interface QuestionCardProps {
  question: QuestionType
  selectedChoiceId: string | null
  onSelectChoice: (choiceId: string) => void
  showFeedback: boolean
  disabled?: boolean
}

export function QuestionCard({
  question,
  selectedChoiceId,
  onSelectChoice,
  showFeedback,
  disabled = false,
}: QuestionCardProps) {
  const correctChoiceId = question.choices.find((c) => c.isCorrect)?.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-6">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Question
            </span>
            <h2 className="text-xl font-medium mt-2 leading-relaxed">
              {question.stem}
            </h2>
          </div>

          <div className="space-y-3">
            {question.choices.map((choice, index) => {
              const isSelected = selectedChoiceId === choice.id
              const isCorrect = choice.id === correctChoiceId

              let variant: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' = 'outline'
              if (showFeedback && isCorrect) {
                variant = 'default'
              } else if (showFeedback && isSelected && !isCorrect) {
                variant = 'destructive'
              } else if (isSelected) {
                variant = 'default'
              }

              return (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant={variant}
                    className="w-full justify-start text-left h-auto py-4 px-4"
                    onClick={() => !disabled && onSelectChoice(choice.id)}
                    disabled={disabled}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span>{choice.text}</span>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
