import { useState, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowLeft, Download, Upload, CheckCircle, XCircle, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { Card } from '@/components/ui/card'
import { downloadExport, uploadBackup } from '@/lib/engines/exportImport'

export function ExportPage() {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    downloadExport()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportStatus('idle')
    setErrorMessage('')

    const result = await uploadBackup(file)

    if (result.success) {
      setImportStatus('success')
    } else {
      setImportStatus('error')
      setErrorMessage(result.error || 'Unknown error')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings">
            <ArrowLeft aria-hidden />
            Kembali
          </Link>
        </Button>
        <h1 className="text-foreground text-xl font-semibold">Ekspor & Impor Data</h1>
      </div>

      <section className="flex flex-col gap-4">
        <SectionLabel>Ekspor Data</SectionLabel>
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Unduh semua data belajar
            </span>
            <span className="text-xs text-muted-foreground">
              Semua progres, XP, streak, kartu, dan pengaturan disimpan dalam file JSON.
              Kamu dapat menggunakan file ini untuk memulihkan data di perangkat lain.
            </span>
          </div>
          <Button onClick={handleExport}>
            <Download aria-hidden />
            Unduh backup JSON
          </Button>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Impor Data</SectionLabel>
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Pulihkan dari file backup
            </span>
            <span className="text-xs text-muted-foreground">
              Impor file JSON yang sebelumnya diekspor. Data saat ini akan ditimpa.
              Halaman akan dimuat ulang setelah impor berhasil.
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={handleImportClick}>
              <Upload aria-hidden />
              Pilih file backup
            </Button>

            {importStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Impor berhasil! Halaman akan dimuat ulang...</span>
              </div>
            )}

            {importStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="h-4 w-4" />
                <span>Gagal: {errorMessage}</span>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Format File</SectionLabel>
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <FileJson className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">JSON</span>
          </div>
          <span className="text-xs text-muted-foreground">
            File backup menggunakan format JSON standar. Tidak memerlukan aplikasi khusus untuk membuka atau membaca file ini.
          </span>
        </Card>
      </section>
    </div>
  )
}
