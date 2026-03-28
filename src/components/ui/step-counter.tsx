import * as React from "react"
import { cn } from "@/lib/utils"

interface StepCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  total: number
  /** Optional prefix label shown before the counter. E.g. "Q" for question. */
  prefix?: string
  /** Size variant controls the numeric display size. */
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: {
    number: "text-2xl",
    label: "text-xs",
  },
  md: {
    number: "text-4xl",
    label: "text-sm",
  },
  lg: {
    number: "text-5xl",
    label: "text-base",
  },
}

/**
 * StepCounter — factory.ai-inspired zero-padded numeric counter.
 *
 * Renders as:   Q  01 / 20
 *               ^  ^    ^
 *               |  |    total (muted)
 *               |  current (primary, mono)
 *               prefix (muted, sans)
 */
function StepCounter({
  current,
  total,
  prefix,
  size = "md",
  className,
  ...props
}: StepCounterProps) {
  const pad = (n: number) => n.toString().padStart(2, "0")
  const sizes = sizeMap[size]

  return (
    <div
      className={cn("flex items-baseline gap-1.5", className)}
      {...props}
    >
      {prefix && (
        <span
          className={cn(
            "font-sans font-medium text-muted-foreground",
            sizes.label
          )}
        >
          {prefix}
        </span>
      )}
      <span
        className={cn(
          "font-mono font-semibold tabular-nums text-primary leading-none",
          sizes.number
        )}
      >
        {pad(current)}
      </span>
      <span
        className={cn(
          "font-mono font-normal tabular-nums text-muted-foreground leading-none",
          sizes.number
        )}
      >
        /
      </span>
      <span
        className={cn(
          "font-mono font-normal tabular-nums text-muted-foreground leading-none",
          sizes.number
        )}
      >
        {pad(total)}
      </span>
    </div>
  )
}

export { StepCounter }
export type { StepCounterProps }
