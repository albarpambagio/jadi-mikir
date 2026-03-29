import { Link, useLocation } from 'wouter'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { StatsBar } from '@/components/dashboard/stats-bar'
import { TodaySessionCard } from '@/components/dashboard/today-session-card'
import { TopicCard } from '@/components/dashboard/topic-card'
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats'
import { learnerStore } from '@/store/learnerStore'

const MAX_TOPIC_CARDS = 6

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="border-border bg-surface-raised flex max-w-sm flex-col gap-6 rounded-lg border p-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-xl font-semibold">Selamat datang di JadiMikir!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Kamu belum punya sesi belajar. Mulai dari sini:
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/session">
              <Play className="size-4" aria-hidden />
              Mulai belajar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/topics">Jelajahi topik dulu</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [, setLocation] = useLocation()
  const {
    isLoading,
    streak,
    totalXP,
    completedCount,
    totalTopics,
    totalDue,
    topicsWithDue,
    getSortedTopics,
    motivationalMessage,
  } = useDashboardStats()

  useEffect(() => {
    const state = learnerStore.get()
    if (!state.hasCompletedOnboarding) {
      setLocation('/onboarding')
    }
  }, [setLocation])

  const isEmpty =
    completedCount === 0 &&
    totalDue === 0 &&
    getSortedTopics.every((t) => !t.masteryProgress)

  const displayTopics = getSortedTopics.slice(0, MAX_TOPIC_CARDS)

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />

      {isLoading ? (
        <DashboardSkeleton />
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Selamat datang kembali!
            </h1>
            <p className="text-muted-foreground text-sm">{motivationalMessage}</p>
          </div>

          <StatsBar
            streak={streak}
            totalXP={totalXP}
            completedCount={completedCount}
            totalTopics={totalTopics}
            totalDue={totalDue}
          />

          <section className="flex flex-col gap-3">
            <SectionLabel>Today's session</SectionLabel>
            <TodaySessionCard totalDue={totalDue} topicsWithDue={topicsWithDue} />
          </section>

          {displayTopics.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionLabel>Continue learning</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {displayTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/topics">
                    View all topics
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
