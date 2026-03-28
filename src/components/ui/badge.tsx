import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent",
        outline: "text-foreground border-border",
        success:
          "bg-success text-success-foreground border-transparent",
        warning:
          "bg-warning text-warning-foreground border-transparent",
        /**
         * factory.ai-inspired classification tag.
         * Compact, square-ish, high-contrast. Use for category labels
         * (e.g. "Matematika", "New", "Remediation") on cards and news items.
         * Intentionally uses tracking-wider — uppercase is permitted for
         * classification labels per the badge exception in TECH_STACK.md.
         */
        tag:
          "rounded-sm border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground",
        "tag-primary":
          "rounded-sm border-transparent bg-primary px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
