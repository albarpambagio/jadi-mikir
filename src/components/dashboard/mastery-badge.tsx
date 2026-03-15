import { memo } from "react"
import { cn } from "@/lib/utils"

type MasteryLevel = "not-started" | "just-started" | "in-progress" | "completed"

interface MasteryBadgeProps {
  level: MasteryLevel
  reviewInDays?: number
  className?: string
}

const masteryConfig: Record<
  MasteryLevel,
  { label: string; className: string }
> = {
  "not-started": {
    label: "Not started",
    className: "border-border bg-muted text-muted-foreground",
  },
  "just-started": {
    label: "Just started",
    className: "border-border bg-secondary text-secondary-foreground",
  },
  "in-progress": {
    label: "In progress",
    className: "border-border bg-accent text-accent-foreground",
  },
  completed: {
    label: "Completed",
    className: "border-transparent bg-primary text-primary-foreground",
  },
}

export const MasteryBadge = memo(function MasteryBadge({
  level,
  reviewInDays,
  className,
}: MasteryBadgeProps) {
  const config = masteryConfig[level]
  const label = level === "completed" && reviewInDays !== undefined 
    ? `Review in ${reviewInDays}d` 
    : config.label

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
        config.className,
        className
      )}
    >
      {label}
    </span>
  )
})
