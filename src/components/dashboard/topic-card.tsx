import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TopicProgressBar } from "./topic-progress-bar"
import { MasteryBadge } from "./mastery-badge"
import { cn } from "@/lib/utils"
import { CheckCircle2, Play, RotateCcw } from "lucide-react"

type MasteryLevel = "not-started" | "just-started" | "in-progress" | "completed"

interface TopicCardProps {
  title: string
  progress: number
  mastery: MasteryLevel
  dueCount?: number
  reviewInDays?: number
  onContinue?: () => void
  onStart?: () => void
  onReview?: () => void
  className?: string
}

const getAction = (
  mastery: MasteryLevel,
  dueCount: number,
  onContinue?: () => void,
  onStart?: () => void,
  onReview?: () => void
) => {
  if (mastery === "completed") {
    return {
      label: "Review",
      icon: RotateCcw,
      onClick: onReview,
      disabled: false,
    }
  }
  if (mastery === "not-started" || mastery === "just-started") {
    return {
      label: "Start",
      icon: Play,
      onClick: onStart,
      disabled: false,
    }
  }
  return {
    label: "Continue",
    icon: Play,
    onClick: onContinue,
    disabled: dueCount === 0,
  }
}

export const TopicCard = memo(function TopicCard({
  title,
  progress,
  mastery,
  dueCount = 0,
  reviewInDays,
  onContinue,
  onStart,
  onReview,
  className,
}: TopicCardProps) {
  const action = getAction(mastery, dueCount, onContinue, onStart, onReview)
  const isCompleted = mastery === "completed"

  return (
    <Card
      size="sm"
      className={cn(
        "transition-shadow hover:shadow-sm",
        isCompleted && "bg-secondary",
        className
      )}
    >
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex min-w-0 items-center gap-2">
          {isCompleted && (
            <CheckCircle2
              className="text-primary size-4 shrink-0"
              aria-hidden
            />
          )}
          <h3 className="text-foreground truncate text-sm font-medium">
            {title}
          </h3>
        </div>

        <TopicProgressBar value={progress} />

        <div className="flex items-center justify-between gap-2">
          <MasteryBadge
            level={mastery}
            reviewInDays={reviewInDays}
            className="text-xs"
          />
          {dueCount > 0 && mastery !== "completed" && (
            <span className="text-muted-foreground text-xs">
              {dueCount} due
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-between"
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
          <action.icon className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  )
})
