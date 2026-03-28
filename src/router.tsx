import { Route, Switch, Router } from 'wouter'
import { Layout } from '@/components/layout/layout'
import { DashboardPage } from '@/pages/home'
import { ProgressDashboardPage } from '@/pages/progress'
import { SessionPage } from '@/pages/session'
import { TopicsPage } from '@/pages/topics'
import { TopicListPage } from '@/pages/topic-list'

export function AppRouter() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/progress" component={ProgressDashboardPage} />
          <Route path="/topics" component={TopicsPage} />
          <Route path="/topics/:subject" component={TopicListPage} />
          <Route path="/session/:topicId" component={SessionPage} />
          <Route path="/session" component={SessionPage} />
          <Route>
            <div className="py-20 text-center">
              <h1 className="text-2xl font-semibold">404 - Not found</h1>
              <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
            </div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}
