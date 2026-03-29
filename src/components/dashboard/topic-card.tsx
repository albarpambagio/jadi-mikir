import { Link } from 'wouter'
import { ArrowRight, BookOpen } from 'lucide-react'
import { toSlug } from '@/lib/hooks/use-topic-browser'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { TopicWithProgress } from '@/lib/hooks/use-dashboard-stats'

function MasteryBar({ value, className }: { value: number; className?: string }) {
  if (value === 0) {
    return <div className={cn('h-1.5 w-full rounded-full bg-border', className)} />
  }
  return <Progress value={value} className={className} />
}

interface TopicCardProps {
  topic: TopicWithProgress
}

function getCtaLabel(topic: TopicWithProgress): string {
  const { masteryProgress, dueCount } = topic
  if (!masteryProgress || masteryProgress.level === 0) return 'Start'
  if (dueCount > 0) return 'Continue'
  return 'Review'
}

function getMasteryBadgeClass(level: number): string {
  if (level >= 5) return 'text-success'
  if (level >= 3) return 'text-primary'
  return 'text-muted-foreground'
}

export function TopicCard({ topic }: TopicCardProps) {
  const { masteryProgress, dueCount } = topic
  const ctaLabel = getCtaLabel(topic)
  const overallPct = masteryProgress ? masteryProgress.current : 0
  const levelName = masteryProgress ? masteryProgress.levelName : 'Not started'
  const badgeClass = getMasteryBadgeClass(masteryProgress?.level ?? 0)

  return (
    <div className="border-border bg-surface-raised flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-start gap-2">
          <BookOpen
            className="text-muted-foreground mt-0.5 size-4 shrink-0"
            aria-hidden
          />
          <span className="text-foreground min-w-0 text-sm leading-snug font-medium">{topic.title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className={`text-xs font-medium ${badgeClass}`}>{levelName}</span>
          {dueCount > 0 && (
            <span className="text-muted-foreground text-xs tabular-nums">
              · {dueCount} due
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
          <span>{overallPct}%</span>
        </div>
        <MasteryBar value={overallPct} className="h-1.5" />
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/topics/${toSlug(topic.subject)}/${topic.id}?from=home`}>Detail topik</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/session/${topic.id}`}>
            {ctaLabel}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  )
}
