import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './router'
import '@fontsource/montserrat'
import '@fontsource/merriweather'
import '@fontsource/source-code-pro'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
