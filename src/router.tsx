import { createRootRoute, createRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Button } from '@/components/ui/button'
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats'

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary hover:opacity-80">
          JadiMikir
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
            Dashboard
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
  const { isLoading, error, streak, totalXP, completedCount, totalTopics, totalDue } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading stats...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-destructive mb-4">Failed to load stats</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-2xl font-bold">{streak} days</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Total XP</p>
          <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Topics Completed</p>
          <p className="text-2xl font-bold">{completedCount}/{totalTopics}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Due Today</p>
          <p className="text-2xl font-bold">{totalDue} cards</p>
        </div>
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
