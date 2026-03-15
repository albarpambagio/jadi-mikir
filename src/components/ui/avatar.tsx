import * as React from "react"

import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

const Avatar: React.FC<AvatarProps> = ({ className, src, alt, fallback, ...props }) => {
  const [error, setError] = React.useState(false)

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium">
          {fallback || alt?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
    </div>
  )
}

export { Avatar }
export type { AvatarProps }
