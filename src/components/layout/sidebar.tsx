import { memo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Settings, BarChart } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean
}

// Memoized NavItem component to prevent unnecessary re-renders
const NavItem = memo(({ 
  icon: Icon, 
  label, 
  collapsed 
}: { 
  icon: React.ComponentType<{ className?: string }>, 
  label: string, 
  collapsed: boolean 
}) => (
  <Button
    variant="ghost"
    className={cn("w-full justify-start", collapsed && "justify-center px-2")}
  >
    <Icon className="w-5 h-5" />
    {!collapsed && <span className="ml-2">{label}</span>}
  </Button>
))

NavItem.displayName = "NavItem"

export const Sidebar = memo(function Sidebar({ className, collapsed = false, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-background border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        <div className={cn("flex items-center gap-2", collapsed && "flex-col gap-1")}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold text-lg">JadiMikir</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        <NavItem icon={Home} label="Dashboard" collapsed={collapsed} />
        <NavItem icon={BarChart} label="Progress" collapsed={collapsed} />
        <NavItem icon={Settings} label="Settings" collapsed={collapsed} />
      </nav>

      {/* User Area */}
      <div className="p-2 border-t border-border">
        <NavItem 
          icon={() => (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
              U
            </div>
          )} 
          label="User Profile" 
          collapsed={collapsed} 
        />
      </div>
    </aside>
  )
})
