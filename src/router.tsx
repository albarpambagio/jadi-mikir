import { Route, Switch, Router } from 'wouter'
import { Layout } from '@/components/layout/layout'
import { DashboardPage } from '@/pages/home'
import { ProgressDashboardPage } from '@/pages/progress'
import { SessionPage } from '@/pages/session'
import { TopicsPage } from '@/pages/topics'
import { TopicListPage } from '@/pages/topic-list'
import { TopicDetailPage } from '@/pages/topic-detail'
import { OnboardingWelcome } from '@/pages/onboarding/welcome'
import { OnboardingSubjectSelect } from '@/pages/onboarding/subject-select'
import { OnboardingDiagnostic } from '@/pages/onboarding/diagnostic'
import { OnboardingResults } from '@/pages/onboarding/results'
import { OnboardingRouteGuard } from '@/components/onboarding-route-guard'
import { SettingsPage } from '@/pages/settings'
import { ExportPage } from '@/pages/export'

export function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/onboarding">
          <OnboardingRouteGuard>
            <OnboardingWelcome />
          </OnboardingRouteGuard>
        </Route>
        <Route path="/onboarding/subject">
          <OnboardingRouteGuard>
            <OnboardingSubjectSelect />
          </OnboardingRouteGuard>
        </Route>
        <Route path="/onboarding/diagnostic">
          <OnboardingRouteGuard>
            <OnboardingDiagnostic />
          </OnboardingRouteGuard>
        </Route>
        <Route path="/onboarding/results">
          <OnboardingRouteGuard>
            <OnboardingResults />
          </OnboardingRouteGuard>
        </Route>
        <Route path="/">
          <Layout>
            <DashboardPage />
          </Layout>
        </Route>
        <Route path="/progress">
          <Layout>
            <ProgressDashboardPage />
          </Layout>
        </Route>
        <Route path="/topics">
          <Layout>
            <TopicsPage />
          </Layout>
        </Route>
        <Route path="/topics/:subject/:topicId">
          <Layout>
            <TopicDetailPage />
          </Layout>
        </Route>
        <Route path="/topics/:subject">
          <Layout>
            <TopicListPage />
          </Layout>
        </Route>
        <Route path="/session/:topicId">
          <Layout>
            <SessionPage />
          </Layout>
        </Route>
        <Route path="/session">
          <Layout>
            <SessionPage />
          </Layout>
        </Route>
        <Route path="/settings">
          <Layout>
            <SettingsPage />
          </Layout>
        </Route>
        <Route path="/settings/export">
          <Layout>
            <ExportPage />
          </Layout>
        </Route>
        <Route>
          <Layout>
            <div className="py-20 text-center">
              <h1 className="text-2xl font-semibold">404 - Not found</h1>
              <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
            </div>
          </Layout>
        </Route>
      </Switch>
    </Router>
  )
}
