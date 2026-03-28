import { Link } from 'wouter'
import { Download, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadExport } from '@/lib/engines/exportImport'

export function DashboardHeader() {
  return (
    <header className="border-border mb-8 flex items-center justify-between border-b pb-4">
      <Link href="/" className="font-mono text-lg font-semibold text-foreground">
        JadiMikir
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={downloadExport}>
          <Download aria-hidden />
          Export data
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href="/settings" aria-label="Settings">
            <Settings aria-hidden />
          </Link>
        </Button>
      </div>
    </header>
  )
}
