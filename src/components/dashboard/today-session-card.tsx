import { Link } from 'wouter'
import { Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TodaySessionCardProps {
  totalDue: number
  topicsWithDue: number
}

export function TodaySessionCard({ totalDue, topicsWithDue }: TodaySessionCardProps) {
  const hasDue = totalDue > 0

  return (
    <div className="border-border bg-surface-raised divide-border divide-y rounded-lg border">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-foreground text-sm font-medium">Start review session</span>
          {hasDue ? (
            <span className="text-muted-foreground text-xs">
              {totalDue} due {totalDue === 1 ? 'card' : 'cards'} across {topicsWithDue}{' '}
              {topicsWithDue === 1 ? 'topic' : 'topics'}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">No cards due right now</span>
          )}
        </div>
        <Button asChild disabled={!hasDue} className="shrink-0">
          <Link href="/session">
            <Play className="size-4" aria-hidden />
            Review now
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-foreground text-sm font-medium">Start new topic</span>
          <span className="text-muted-foreground text-xs">Browse all topics in skill tree</span>
        </div>
        <Button variant="outline" asChild className="shrink-0">
          <Link href="/session">
            <Plus className="size-4" aria-hidden />
            New topic
          </Link>
        </Button>
      </div>
    </div>
  )
}
