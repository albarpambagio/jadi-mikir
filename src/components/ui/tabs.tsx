"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

/**
 * NumberedTabsList — factory.ai-inspired borderless tab strip.
 *
 * Renders as a plain horizontal list with no pill background. Tabs separate
 * visually only through color and a bottom border on the active item.
 * Pair with NumberedTabsTrigger.
 */
const NumberedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-end gap-6 border-b border-border",
      className
    )}
    {...props}
  />
))
NumberedTabsList.displayName = "NumberedTabsList"

interface NumberedTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Zero-based index used to generate the "01 ·" prefix automatically. */
  index: number
}

/**
 * NumberedTabsTrigger — trigger for use inside NumberedTabsList.
 *
 * Renders the tab label prefixed with a zero-padded monospace number:
 *   01 · Matematika
 *
 * Active state: full-opacity foreground + 2px primary bottom border.
 * Inactive state: muted foreground, no border.
 */
const NumberedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  NumberedTabsTriggerProps
>(({ className, index, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group flex items-baseline gap-1.5 pb-2.5 text-sm transition-colors",
      "border-b-2 border-transparent -mb-px",
      "text-muted-foreground hover:text-foreground",
      "data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span className="font-mono text-xs tabular-nums text-muted-foreground group-data-[state=active]:text-primary">
      {(index + 1).toString().padStart(2, "0")}
    </span>
    <span className="font-sans">·</span>
    <span>{children}</span>
  </TabsPrimitive.Trigger>
))
NumberedTabsTrigger.displayName = "NumberedTabsTrigger"

export { Tabs, TabsList, TabsTrigger, TabsContent, NumberedTabsList, NumberedTabsTrigger }
export type { NumberedTabsTriggerProps }
