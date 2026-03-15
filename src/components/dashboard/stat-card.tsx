import { memo } from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  variant?: "default" | "fire" | "xp" | "topics" | "due"
  className?: string
}

export const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-surface-raised p-4 transition-shadow hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <Icon className="text-muted-foreground size-4" />
      </div>
      <p className="text-foreground text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  )
})
