import { useState, useEffect } from 'react'
import { createRootRoute, createRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Button, Progress, Card, CardBody, Spinner } from '@heroui/react'
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
      <nav className="border-b border-divider px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary hover:opacity-80">
          JadiMikir
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="light" as={Link} href="/">
            Dashboard
          </Button>
          <Button size="sm" variant="light" as={Link} href="/session">
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
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-warning" />
              <p className="text-sm text-foreground-500">Current Streak</p>
            </div>
            <p className="text-3xl font-bold text-warning">{learnerState.streak}</p>
            <p className="text-xs text-foreground-400">days</p>
          </CardBody>
        </Card>
        
        <Card className="bg-card">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground-500">Total XP</p>
            </div>
            <p className="text-3xl font-bold text-primary">{learnerState.xp}</p>
            <p className="text-xs text-foreground-400">points</p>
          </CardBody>
        </Card>
      </div>

      {currentTopic && (
        <Card className="bg-card mb-6">
          <CardBody className="p-4">
            <h3 className="font-semibold mb-3">{currentTopic.title}</h3>
            {masteryProgress ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-500">Mastery Progress</span>
                  <span className="font-medium">{masteryProgress.levelName}</span>
                </div>
                <Progress
                  value={masteryProgress.percentage}
                  color="primary"
                  className="h-2"
                />
                <p className="text-xs text-foreground-400">
                  {masteryProgress.current}% - {masteryProgress.target}% to next level
                </p>
              </div>
            ) : (
              <p className="text-sm text-foreground-500">Start practicing to track your progress</p>
            )}
          </CardBody>
        </Card>
      )}
      
      <Button 
        color="primary" 
        size="lg" 
        className="w-full"
        as={Link}
        href="/session"
        endContent={<ChevronRight className="w-4 h-4" />}
      >
        Start Practice Session
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
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-foreground-500">No questions available</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-foreground-500">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-foreground-500">{answeredCount} answered</span>
        </div>
        <Progress
          value={((currentIndex + 1) / questions.length) * 100}
          color="primary"
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
                color="primary"
                size="lg"
                className="w-full"
                onPress={handleSubmitAnswer}
                isDisabled={!selectedChoice}
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
                color="primary"
                as={Link}
                href="/"
                className="w-full"
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
