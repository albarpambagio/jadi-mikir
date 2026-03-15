import { memo } from "react"
import { cn } from "@/lib/utils"

interface TopicProgressBarProps {
  value: number
  showLabel?: boolean
  size?: "sm" | "md"
  className?: string
}

const colorByProgress = (value: number): string => {
  if (value >= 100) return "bg-primary"
  if (value >= 50) return "bg-primary/70"
  if (value >= 25) return "bg-primary/50"
  return "bg-primary/30"
}

export const TopicProgressBar = memo(function TopicProgressBar({
  value,
  showLabel = true,
  size = "sm",
  className,
}: TopicProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const trackClass = size === "sm" ? "h-1.5" : "h-2"

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-full bg-muted",
          trackClass
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", colorByProgress(clampedValue))}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-muted-foreground w-8 text-right text-xs font-medium tabular-nums">
          {clampedValue}%
        </span>
      )}
    </div>
  )
})
