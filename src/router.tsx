import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  )
}

function Dashboard() {
  return <div className="text-foreground">Dashboard placeholder</div>
}

const rootRoute = createRootRoute({ component: Layout })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Dashboard })
const routeTree = rootRoute.addChildren([indexRoute])
export { routeTree }
