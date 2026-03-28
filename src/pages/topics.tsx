import { useLayoutEffect, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SubjectCard } from '@/components/topics/subject-card'
import { useTopicBrowserData } from '@/lib/hooks/use-topic-browser'

function TopicsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border bg-surface-raised rounded-lg border p-4">
            <Skeleton className="mb-1 h-5 w-32" />
            <Skeleton className="mb-4 h-3 w-24" />
            <Skeleton className="mb-2 h-1.5 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TopicsPage() {
  const { subjects, isLoading } = useTopicBrowserData()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    document.title = 'All Topics — JadiMikir'
    headingRef.current?.focus()
  }, [])

  const activeCount = subjects.filter((s) => s.isActive).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/">
            <ArrowLeft aria-hidden />
            Back
          </Link>
        </Button>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-foreground text-xl font-semibold outline-none"
        >
          All Topics
        </h1>
      </div>

      {isLoading ? (
        <TopicsPageSkeleton />
      ) : (
        <>
          {/* Summary line */}
          <p className="text-muted-foreground text-sm">
            {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
            {activeCount > 0 && (
              <span>
                {' '}
                · {activeCount} active
              </span>
            )}
          </p>

          {/* Subject grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {subjects.map((group) => (
              <SubjectCard key={group.subject} group={group} />
            ))}
          </div>

          {/* Footer note */}
          <p className="text-muted-foreground border-border border-t pt-4 text-xs leading-relaxed">
            Each subject is independent. Progress is saved between subjects.
          </p>
        </>
      )}
    </div>
  )
}
