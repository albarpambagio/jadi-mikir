import { BookOpenCheck, Flame, Layers, Sparkles } from 'lucide-react'
import { StatDisplay } from '@/components/ui/stat-display'

interface StatsBarProps {
  streak: number
  totalXP: number
  completedCount: number
  totalTopics: number
  totalDue: number
}

export function StatsBar({ streak, totalXP, completedCount, totalTopics, totalDue }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="border-border bg-surface-raised flex flex-col gap-3 rounded-lg border p-4">
        <Flame className="text-primary size-5 shrink-0" aria-hidden />
        <StatDisplay value={streak} unit={streak === 1 ? 'day' : 'days'} label="Streak" size="sm" />
      </div>
      <div className="border-border bg-surface-raised flex flex-col gap-3 rounded-lg border p-4">
        <Sparkles className="text-primary size-5 shrink-0" aria-hidden />
        <StatDisplay value={totalXP.toLocaleString()} label="XP total" size="sm" />
      </div>
      <div className="border-border bg-surface-raised flex flex-col gap-3 rounded-lg border p-4">
        <BookOpenCheck className="text-primary size-5 shrink-0" aria-hidden />
        <StatDisplay
          value={`${completedCount} / ${totalTopics}`}
          label="Topics done"
          size="sm"
        />
      </div>
      <div className="border-border bg-surface-raised flex flex-col gap-3 rounded-lg border p-4">
        <Layers className="text-primary size-5 shrink-0" aria-hidden />
        <StatDisplay value={totalDue} unit={totalDue === 1 ? 'card' : 'cards'} label="Due today" size="sm" />
      </div>
    </div>
  )
}
