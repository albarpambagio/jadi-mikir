import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface AccordionItem {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  defaultValue?: string
  className?: string
}

const Accordion: React.FC<AccordionProps> = ({ items, defaultValue, className }) => {
  const [openValue, setOpenValue] = React.useState<string | null>(defaultValue || null)

  return (
    <div className={cn("w-full", className)}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.value}
          item={item}
          isOpen={openValue === item.value}
          onToggle={() => setOpenValue(openValue === item.value ? null : item.value)}
        />
      ))}
    </div>
  )
}

interface AccordionItemComponentProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  item,
  isOpen,
  onToggle,
}) => (
  <div className="border-b">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
    >
      {item.trigger}
      <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
    <div
      className={cn(
        "overflow-hidden text-sm transition-all duration-300",
        isOpen ? "max-h-[500px] pb-4" : "max-h-0"
      )}
    >
      {item.content}
    </div>
  </div>
)

export { Accordion }
export type { AccordionProps }
