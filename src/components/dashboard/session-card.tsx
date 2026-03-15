import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Play, Plus } from "lucide-react"

interface SessionCardProps {
  type: "review" | "new-topic"
  title: string
  description: string
  onAction: () => void
  className?: string
}

const config = {
  review: {
    icon: Play,
    label: "Start review",
    variant: "default" as const,
  },
  "new-topic": {
    icon: Plus,
    label: "New topic",
    variant: "outline" as const,
  },
} as const

export const SessionCard = memo(function SessionCard({
  type,
  title,
  description,
  onAction,
  className,
}: SessionCardProps) {
  const { icon: Icon, label, variant } = config[type]

  return (
    <Card
      size="sm"
      className={cn("transition-shadow hover:shadow-sm", className)}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            type === "review"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground truncate text-xs">{description}</p>
        </div>
        <Button variant={variant} size="sm" onClick={onAction}>
          {label}
        </Button>
      </CardContent>
    </Card>
  )
})
