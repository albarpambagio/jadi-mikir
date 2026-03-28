import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useRoute } from 'wouter'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { Skeleton } from '@/components/ui/skeleton'
import { TopicRow } from '@/components/topics/topic-row'
import { useTopicBrowserData, toSlug } from '@/lib/hooks/use-topic-browser'
import type { TopicWithStatus } from '@/lib/hooks/use-topic-browser'

function TopicListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-border bg-surface-raised flex gap-3 rounded-lg border p-4">
          <Skeleton className="mt-0.5 size-2 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-1.5 w-full" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  )
}

const LOCKED_VISIBLE = 4

function GroupSection({
  label,
  topics,
  collapsible = false,
}: {
  label: string
  topics: TopicWithStatus[]
  collapsible?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  if (topics.length === 0) return null

  const displayTopics = collapsible && !expanded ? topics.slice(0, LOCKED_VISIBLE) : topics
  const hiddenCount = topics.length - LOCKED_VISIBLE

  return (
    <section className="flex flex-col gap-1">
      <SectionLabel>{label}</SectionLabel>
      <div className="border-border bg-surface-raised divide-border divide-y rounded-lg border">
        {displayTopics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </div>
      {collapsible && !expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-muted-foreground hover:text-foreground self-start pt-1 text-xs transition-colors"
        >
          ··· {hiddenCount} more locked {hiddenCount === 1 ? 'topic' : 'topics'}
        </button>
      )}
    </section>
  )
}

export function TopicListPage() {
  const [, params] = useRoute<{ subject: string }>('/topics/:subject')
  const subjectSlug = params?.subject ?? ''

  const { subjects, isLoading, getTopicsBySubject } = useTopicBrowserData()
  const headingRef = useRef<HTMLHeadingElement>(null)

  const group = useMemo(
    () => subjects.find((s) => s.slug === subjectSlug) ?? null,
    [subjects, subjectSlug],
  )

  const categorized = useMemo(
    () => (group ? getTopicsBySubject(group.subject) : null),
    [group, getTopicsBySubject],
  )

  const subjectTitle = group?.subject ?? 'Subject Not Found'

  useLayoutEffect(() => {
    document.title = `${subjectTitle} — JadiMikir`
    headingRef.current?.focus()
  }, [subjectTitle])

  const totalCount = group?.totalTopics ?? 0
  const inProgressCount = categorized?.inProgress.length ?? 0
  const masteredCount = categorized?.mastered.length ?? 0
  const availableCount = categorized?.available.length ?? 0
  const lockedCount = categorized?.locked.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/topics">
            <ArrowLeft aria-hidden />
            All Topics
          </Link>
        </Button>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-foreground text-xl font-semibold outline-none"
        >
          {subjectTitle}
        </h1>
      </div>

      {isLoading ? (
        <TopicListSkeleton />
      ) : !group ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-sm">Subject not found.</p>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/topics">Browse all subjects</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Summary line */}
          <p className="text-muted-foreground text-sm">
            {totalCount} {totalCount === 1 ? 'topic' : 'topics'}
            {inProgressCount > 0 && ` · ${inProgressCount} in progress`}
            {masteredCount > 0 && ` · ${masteredCount} mastered`}
            {availableCount > 0 && ` · ${availableCount} available to start`}
            {lockedCount > 0 && ` · ${lockedCount} locked`}
          </p>

          {/* Topic groups */}
          <div className="flex flex-col gap-6">
            <GroupSection label="In progress" topics={categorized!.inProgress} />
            <GroupSection label="Mastered" topics={categorized!.mastered} />
            <GroupSection label="Available to start" topics={categorized!.available} />
            <GroupSection label="Locked" topics={categorized!.locked} collapsible />
          </div>

          {/* Skill tree CTA (deferred) */}
          <div className="flex justify-end border-t border-border pt-4">
            <Button variant="outline" size="sm" disabled>
              View Skill Tree
              <ArrowLeft className="rotate-180" aria-hidden />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
