import { Route, Switch, Router } from 'wouter'
import { Layout } from '@/components/layout/layout'
import { ComponentShowcase } from '@/components/showcase/component-showcase'

export function AppRouter() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" component={ComponentShowcase} />
          <Route>
            <div className="text-center py-20">
              <h1 className="text-2xl font-semibold">404 - Not Found</h1>
              <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
            </div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}
