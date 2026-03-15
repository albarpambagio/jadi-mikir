import { createRootRoute, createRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Flame, Star, Target, Clock } from "lucide-react"
import {
  DashboardHeader,
  StatCard,
  SessionCard,
  TopicCard,
} from "@/components/dashboard"

type MasteryLevel = "not-started" | "just-started" | "in-progress" | "completed"

interface MockTopic {
  id: string
  title: string
  progress: number
  mastery: MasteryLevel
  dueCount: number
  reviewInDays?: number
}

const mockStats = {
  streak: 12,
  totalXP: 4820,
  completedTopics: 18,
  totalTopics: 42,
  dueToday: 14,
  topicsWithDue: 5,
}

const mockTopics: MockTopic[] = [
  {
    id: "1",
    title: "Sistem Persamaan Linear",
    progress: 62,
    mastery: "in-progress",
    dueCount: 8,
  },
  {
    id: "2",
    title: "Trigonometri Dasar",
    progress: 12,
    mastery: "just-started",
    dueCount: 0,
  },
  {
    id: "3",
    title: "Bilangan Bulat",
    progress: 100,
    mastery: "completed",
    dueCount: 0,
    reviewInDays: 4,
  },
  {
    id: "4",
    title: "Faktorisasi Prima",
    progress: 58,
    mastery: "in-progress",
    dueCount: 3,
  },
]

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary hover:opacity-80">
          JadiMikir
        </Link>
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">Dashboard</span>
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
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <DashboardHeader
        onExport={() => console.log("Export")}
        onSettings={() => console.log("Settings")}
      />

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Selamat kembali!
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${mockStats.streak} days`}
            variant="fire"
          />
          <StatCard
            icon={Star}
            label="XP Total"
            value={mockStats.totalXP.toLocaleString()}
            variant="xp"
          />
          <StatCard
            icon={Target}
            label="Topics Done"
            value={`${mockStats.completedTopics} / ${mockStats.totalTopics}`}
            variant="topics"
          />
          <StatCard
            icon={Clock}
            label="Due Today"
            value={`${mockStats.dueToday} cards`}
            variant="due"
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Today's Session
        </h3>
        <div className="grid gap-3">
          <SessionCard
            type="review"
            title="Start Review Session"
            description={`${mockStats.dueToday} due cards across ${mockStats.topicsWithDue} topics`}
            onAction={() => console.log("Start review")}
          />
          <SessionCard
            type="new-topic"
            title="Start New Topic"
            description="Browse all topics in skill tree"
            onAction={() => console.log("New topic")}
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Continue Learning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              progress={topic.progress}
              mastery={topic.mastery}
              dueCount={topic.dueCount}
              reviewInDays={topic.reviewInDays}
              onContinue={() => console.log("Continue", topic.id)}
              onStart={() => console.log("Start", topic.id)}
              onReview={() => console.log("Review", topic.id)}
            />
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View Skill Tree →
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View All Topics →
        </Link>
      </div>
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

const routeTree = rootRoute.addChildren([indexRoute])

export { routeTree }
