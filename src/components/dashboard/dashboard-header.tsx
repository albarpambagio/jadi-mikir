import { memo } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Download, Settings } from "lucide-react"

interface DashboardHeaderProps {
  userName?: string
  onExport?: () => void
  onSettings?: () => void
  className?: string
}

export const DashboardHeader = memo(function DashboardHeader({
  userName,
  onExport,
  onSettings,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-border",
        className
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h1 className="text-foreground text-xl font-semibold">JadiMikir</h1>
        {userName && (
          <p className="text-muted-foreground text-sm">Hi, {userName}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="gap-1.5"
        >
          <Download className="size-4" />
          Export
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
})
