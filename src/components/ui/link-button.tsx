import { Link } from 'wouter'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

const linkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-primary hover:underline underline-offset-4",
        destructive: "text-destructive hover:underline underline-offset-4",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        plain: "text-foreground",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-8 py-2.5",
        icon: "h-9 w-9",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface LinkButtonProps 
  extends VariantProps<typeof linkButtonVariants> {
  className?: string
  href: string
  children: React.ReactNode
}

export function LinkButton({ 
  className, 
  variant, 
  size, 
  children, 
  href,
  ...props 
}: LinkButtonProps) {
  return (
    <Link 
      href={href}
      className={cn(linkButtonVariants({ variant, size, className }))} 
      {...props}
    >
      {children}
    </Link>
  )
}

export { linkButtonVariants }
