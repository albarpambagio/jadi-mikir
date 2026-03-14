import { useState, useEffect } from 'react'
import { createRootRoute, createRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Flame, Zap, ChevronRight } from 'lucide-react'
import { QuestionCard, FeedbackPanel } from '@/components/questions'
import { useTopicsQuery, useQuestionsQuery } from '@/lib/content'
import { learnerStore, learnerActions } from '@/store/learnerStore'
import { getMasteryProgress } from '@/lib/engines/mastery'
import { processReview, createNewCard } from '@/lib/engines/fsrs'
import type { Rating } from '@/types'

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary hover:opacity-80">
          JadiMikir
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} >
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/session'} >
            Practice
          </Button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  )
}

function Dashboard() {
  const [learnerState, setLearnerState] = useState(learnerStore.getState())
  const { data: topics } = useTopicsQuery()

  const currentTopic = topics?.[0]
  const mastery = currentTopic ? learnerState.topics[currentTopic.id] : null
  const masteryProgress = mastery ? getMasteryProgress(mastery) : null

  useEffect(() => {
    const unsubscribe = learnerStore.subscribe(() => {
      setLearnerState(learnerStore.getState())
    })
    return () => { unsubscribe() }
  }, [])

  useEffect(() => {
    if (currentTopic && !mastery) {
      learnerActions.initializeTopicMastery(currentTopic.id, currentTopic.questionCount)
    }
  }, [currentTopic, mastery])

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            <p className="text-3xl font-bold text-orange-500">{learnerState.streak}</p>
            <p className="text-xs text-muted-foreground/60">days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
            <p className="text-3xl font-bold text-primary">{learnerState.xp}</p>
            <p className="text-xs text-muted-foreground/60">points</p>
          </CardContent>
        </Card>
      </div>

      {currentTopic && (
        <Card className="bg-card mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">{currentTopic.title}</h3>
            {masteryProgress ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mastery Progress</span>
                  <span className="font-medium">{masteryProgress.levelName}</span>
                </div>
                <Progress
                  value={masteryProgress.percentage}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground/60">
                  {masteryProgress.current}% - {masteryProgress.target}% to next level
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Start practicing to track your progress</p>
            )}
          </CardContent>
        </Card>
      )}
      
      <Button 
        size="lg" 
        className="w-full gap-2"
        onClick={() => window.location.href = '/session'}
      >
        Start Practice Session
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

function Session() {
  const { data: questions, isLoading: questionsLoading } = useQuestionsQuery('english-grammar')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [learnerState, setLearnerState] = useState(learnerStore.getState())

  useEffect(() => {
    const unsubscribe = learnerStore.subscribe(() => {
      setLearnerState(learnerStore.getState())
    })
    return () => { unsubscribe() }
  }, [])
  
  const currentQuestion = questions?.[currentIndex]
  const isLastQuestion = currentIndex >= (questions?.length ?? 0) - 1

  const handleSelectChoice = (choiceId: string) => {
    if (showFeedback) return
    setSelectedChoice(choiceId)
  }

  const handleSubmitAnswer = () => {
    if (!selectedChoice || !currentQuestion) return
    setShowFeedback(true)
    setAnsweredCount((prev) => prev + 1)

    // Auto-rate after showing feedback
    const correctChoice = currentQuestion.choices.find((c: any) => c.isCorrect)
    const isCorrect = selectedChoice === correctChoice?.id
    const rating: Rating = isCorrect ? 'good' : 'hard'

    // Process the review
    const cardId = `${currentQuestion.id}_card`
    const existingCard = learnerState.cards[cardId]
    let cardState = existingCard ?? createNewCard(currentQuestion.id).state

    const { nextCard, reviewLog } = processReview(cardState, currentQuestion.id, rating)

    if (existingCard) {
      learnerActions.updateCard(cardId, nextCard)
    } else {
      learnerActions.createCard(cardId, currentQuestion.id)
    }

    learnerActions.addReviewLog(reviewLog)

    // Award XP
    const xpGain = rating === 'good' ? 10 : 5
    learnerActions.addXP(isCorrect ? xpGain : Math.floor(xpGain / 2))

    // Update mastery
    const currentMastery = learnerState.topics['english-grammar']
    if (currentMastery) {
      const masteredCount = isCorrect ? currentMastery.masteredQuestions + 1 : currentMastery.masteredQuestions
      learnerActions.updateTopicMastery('english-grammar', {
        masteredQuestions: Math.min(masteredCount, currentMastery.totalQuestions),
        lastPracticed: new Date().toISOString(),
        level: Math.floor((masteredCount / currentMastery.totalQuestions) * 5),
      })
    }

    learnerActions.updateStreak()

    // Auto-advance after delay
    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1)
        setSelectedChoice(null)
        setShowFeedback(false)
      }
    }, 1500)
  }

  const handleRate = (_rating: Rating) => {
    // No longer used - kept for compatibility
  }

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-muted-foreground">No questions available</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-muted-foreground">{answeredCount} answered</span>
        </div>
        <Progress
          value={((currentIndex + 1) / questions.length) * 100}
          className="h-2"
        />
      </div>

      {currentQuestion && (
        <>
          <QuestionCard
            question={currentQuestion}
            selectedChoiceId={selectedChoice}
            onSelectChoice={handleSelectChoice}
            showFeedback={showFeedback}
          />

          {!showFeedback && (
            <div className="mt-6">
              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmitAnswer}
                disabled={!selectedChoice}
              >
                Check Answer
              </Button>
            </div>
          )}

          <FeedbackPanel
            question={currentQuestion}
            selectedChoiceId={selectedChoice}
            onRate={handleRate}
            isVisible={showFeedback}
          />

          {showFeedback && isLastQuestion && (
            <div className="mt-6 text-center">
              <Button
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const rootRoute = createRootRoute({
  component: Layout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session',
  component: Session,
})

const routeTree = rootRoute.addChildren([indexRoute, sessionRoute])

export { routeTree }
