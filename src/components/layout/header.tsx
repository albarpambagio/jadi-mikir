import { memo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search, Bell, User, Menu } from "lucide-react"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  onMenuToggle?: () => void
}

export const Header = memo(function Header({ className, onMenuToggle, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "h-16 flex items-center justify-between px-4 bg-background border-b border-border",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions, topics..."
            className="pl-9 pr-4 py-2 w-64 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
})
