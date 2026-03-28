import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Show the filled bullet (•) prefix in primary color before the label text.
   * Defaults to true — matches the factory.ai eyebrow dot pattern.
   */
  showPrefix?: boolean
}

/**
 * SectionLabel — factory.ai-inspired eyebrow label above section headings.
 *
 * Renders as small, tracked, muted sans text with a primary-colored bullet
 * prefix — sentence case (no uppercase per TECH_STACK constraint).
 * Use above an `<h2>` or `<h3>` to signal the section category.
 *
 * Example:
 *   • Today's progress       ← SectionLabel (with dot)
 *   Continue learning        ← h2 heading
 */
function SectionLabel({
  children,
  showPrefix = true,
  className,
  ...props
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    >
      {showPrefix && (
        <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
      )}
      {children}
    </p>
  )
}

export { SectionLabel }
export type { SectionLabelProps }
