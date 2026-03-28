import * as React from "react"
import { cn } from "@/lib/utils"

interface StatDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The numeric or string value to highlight (rendered in monospace, primary). */
  value: string | number
  /** Short label beneath the value (rendered in sans, muted). */
  label: string
  /** Optional unit appended to the value inline. E.g. "%" or "xp". */
  unit?: string
  /** Size of the value readout. */
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { value: "text-2xl", unit: "text-sm", label: "text-xs" },
  md: { value: "text-3xl", unit: "text-base", label: "text-sm" },
  lg: { value: "text-4xl", unit: "text-lg", label: "text-sm" },
}

/**
 * StatDisplay — factory.ai-inspired metric readout.
 *
 * Renders numeric values in monospace Source Code Pro, 1 size larger than
 * the muted sans label beneath it. Use for dashboard stats, session summaries,
 * and any quantitative readout.
 *
 * Example:
 *   120
 *   XP earned
 */
function StatDisplay({
  value,
  label,
  unit,
  size = "md",
  className,
  ...props
}: StatDisplayProps) {
  const sizes = sizeMap[size]

  return (
    <div className={cn("flex flex-col gap-0.5", className)} {...props}>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono font-semibold tabular-nums leading-none text-foreground",
            sizes.value
          )}
        >
          {value}
        </span>
        {unit && (
          <span
            className={cn(
              "font-mono font-normal text-muted-foreground leading-none",
              sizes.unit
            )}
          >
            {unit}
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-sans font-medium text-muted-foreground",
          sizes.label
        )}
      >
        {label}
      </span>
    </div>
  )
}

export { StatDisplay }
export type { StatDisplayProps }
