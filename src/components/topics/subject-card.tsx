import { Link } from 'wouter'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { SubjectGroup } from '@/lib/hooks/use-topic-browser'

interface SubjectCardProps {
  group: SubjectGroup
  hasActiveSubject: boolean
}

export function SubjectCard({ group, hasActiveSubject }: SubjectCardProps) {
  const progressPct =
    group.totalTopics > 0
      ? Math.round((group.startedCount / group.totalTopics) * 100)
      : 0

  return (
    <div
      className={cn(
        'border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4',
        group.isActive && 'border-l-primary border-l-4 pl-3',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-base font-semibold">{group.subject}</h2>
            {group.isActive && (
              <span className="text-primary text-xs font-medium">Aktif</span>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {group.totalTopics} topik · {group.totalCards.toLocaleString()} kartu
          </p>
        </div>
      </div>

      {group.isActive ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-muted-foreground text-xs">
              {group.startedCount} / {group.totalTopics} dimulai
            </span>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {progressPct}%
            </span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
          <p className="text-muted-foreground text-xs">
            {group.masteredCount} dikuasai
            {group.totalDue > 0 && (
              <span> · {group.totalDue} jatuh tempo hari ini</span>
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground text-xs">
            {hasActiveSubject ? 'Belum dimulai' : 'Siap dipelajari'}
          </p>
          {group.topicTitles.length > 0 && (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {group.topicTitles.join(' · ')}
              {group.totalTopics > 4 && ` · +${group.totalTopics - 4} lainnya`}
            </p>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <Button
          variant={group.isActive ? 'default' : 'outline'}
          size="sm"
          asChild
          className="self-start"
        >
          <Link href={`/topics/${group.slug}`}>
            {group.isActive
              ? 'Lihat Daftar Topik'
              : hasActiveSubject
                ? 'Ganti ke subjek ini'
                : 'Mulai subjek ini'}
            <ArrowRight aria-hidden />
          </Link>
        </Button>

        {!group.isActive && hasActiveSubject && (
          <p className="text-muted-foreground flex gap-2 text-xs leading-relaxed">
            <AlertTriangle
              className="text-warning mt-0.5 size-4 shrink-0"
              aria-hidden
            />
            <span>
              Mengganti subjek menjeda sesi aktifmu. Progresmu tetap tersimpan.
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
