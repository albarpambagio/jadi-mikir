import { useCallback, useRef, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  defaultHref?: string
  label?: string
  className?: string
}

export function BackButton({ defaultHref = '/', label = 'Kembali', className }: BackButtonProps) {
  const hasHistoryRef = useRef<boolean | null>(null)

  useEffect(() => {
    hasHistoryRef.current = window.history.length > 1
  }, [])

  const handleBack = useCallback(
    (e: React.MouseEvent) => {
      if (hasHistoryRef.current === null) {
        hasHistoryRef.current = window.history.length > 1
      }
      if (hasHistoryRef.current) {
        e.preventDefault()
        window.history.back()
      }
    },
    []
  )

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={className}
      onClick={handleBack}
    >
      <Link href={defaultHref}>
        <ArrowLeft aria-hidden />
        {label}
      </Link>
    </Button>
  )
}
