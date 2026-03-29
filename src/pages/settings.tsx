import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowLeft, ArrowRight, Download, Upload, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { learnerStore, learnerActions } from '@/store/learnerStore'
import { resetAllData } from '@/lib/engines/exportImport'
import type { LearnerState, SessionDuration, NewCardsLimit, StreakGoal, MasteryThreshold, RemediationTrigger } from '@/types'

const SESSION_DURATIONS: { value: SessionDuration; label: string }[] = [
  { value: 10, label: '10 mnt' },
  { value: 20, label: '20 mnt' },
  { value: 30, label: '30 mnt' },
  { value: 0, label: 'Kustom' },
]

const NEW_CARDS_OPTIONS: { value: NewCardsLimit; label: string }[] = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 0, label: 'Tanpa batas' },
]

const STREAK_GOALS: { value: StreakGoal; label: string }[] = [
  { value: 14, label: '14 hari' },
  { value: 30, label: '30 hari' },
  { value: 60, label: '60 hari' },
  { value: 0, label: 'Kustom' },
]

const MASTERY_THRESHOLDS: { value: MasteryThreshold; label: string }[] = [
  { value: 60, label: '60%' },
  { value: 70, label: '70%' },
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
]

function useLearnerState(): LearnerState {
  const [state, setState] = useState(() => learnerStore.get())
  useEffect(() => {
    const sub = learnerStore.subscribe((s) => setState(s))
    return () => sub.unsubscribe()
  }, [])
  return state
}

function SelectionGroup<T extends number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}

function ToggleOption({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`pointer-events-none block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
              value === opt.value
                ? 'border-primary bg-primary'
                : 'border-border bg-transparent'
            }`}
          >
            {value === opt.value && <span className="h-2 w-2 rounded-full bg-white" />}
          </button>
          <span className="text-sm text-foreground">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const state = useLearnerState()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    sessionDurationMinutes,
    newCardsPerSession,
    showDifficultyLabels,
    showAnswerTimer,
    dailyReminderEnabled,
    dailyReminderTime,
    remediationTrigger,
    interleavingEnabled,
    streakGoalDays,
    masteryGateThresholdPercent,
  } = state

  const handlePreferenceChange = <K extends keyof LearnerState>(
    key: K,
    value: LearnerState[K],
  ) => {
    learnerActions.updatePreferences({ [key]: value })
  }

  const handleDeleteAll = () => {
    resetAllData()
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft aria-hidden />
            Kembali
          </Link>
        </Button>
        <h1 className="text-foreground text-xl font-semibold">Pengaturan</h1>
      </div>

      <section className="flex flex-col gap-4">
        <SectionLabel>Preferensi Belajar</SectionLabel>
        <div className="border-border bg-surface-raised flex flex-col gap-6 rounded-lg border p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Target durasi sesi</span>
            <SelectionGroup
              options={SESSION_DURATIONS}
              value={sessionDurationMinutes as SessionDuration}
              onChange={(v) => handlePreferenceChange('sessionDurationMinutes', v)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Kartu baru per sesi</span>
            <SelectionGroup
              options={NEW_CARDS_OPTIONS}
              value={newCardsPerSession as NewCardsLimit}
              onChange={(v) => handlePreferenceChange('newCardsPerSession', v)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <ToggleOption
              label="Tampilkan label kesulitan"
              checked={showDifficultyLabels}
              onChange={(v) => handlePreferenceChange('showDifficultyLabels', v)}
            />
            <ToggleOption
              label="Tampilkan timer jawaban"
              checked={showAnswerTimer}
              onChange={(v) => handlePreferenceChange('showAnswerTimer', v)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <ToggleOption
              label={`Pengingat harian ${dailyReminderEnabled ? `: ${dailyReminderTime}` : ''}`}
              checked={dailyReminderEnabled}
              onChange={(v) => handlePreferenceChange('dailyReminderEnabled', v)}
            />
            <span className="text-xs text-muted-foreground">
              Memerlukan izin notifikasi browser. Jika ditolak, pengingat tidak berfungsi.
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Pengaturan Mastery</SectionLabel>
        <div className="border-border bg-surface-raised flex flex-col gap-6 rounded-lg border p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Threshold mastery gate
            </span>
            <SelectionGroup
              options={MASTERY_THRESHOLDS}
              value={masteryGateThresholdPercent as MasteryThreshold}
              onChange={(v) => handlePreferenceChange('masteryGateThresholdPercent', v)}
            />
            <span className="text-xs text-muted-foreground">
              Ini adalah nilai yang harus dicapai untuk membuka topik berikutnya.
              Pengaturan ini juga terlihat di layar Mastery Gate saat kamu mencapainya.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Trigger remediasi</span>
            <RadioGroup
              options={[
                { value: 'auto', label: 'Otomatis — setelah 2 kali salah berturut' },
                { value: 'manual', label: 'Manual — saya yang pilih kapan latihan' },
              ]}
              value={remediationTrigger}
              onChange={(v) => handlePreferenceChange('remediationTrigger', v as RemediationTrigger)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <ToggleOption
              label="Interleaving — campur topik tiap sesi"
              checked={interleavingEnabled}
              onChange={(v) => handlePreferenceChange('interleavingEnabled', v)}
            />
            <span className="text-xs text-muted-foreground">
              Nonaktif — fokus satu topik
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Tujuan Streak</SectionLabel>
        <div className="border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4">
          <SelectionGroup
            options={STREAK_GOALS}
            value={streakGoalDays as StreakGoal}
            onChange={(v) => handlePreferenceChange('streakGoalDays', v)}
          />
          <span className="text-xs text-muted-foreground">
            Ditampilkan sebagai bilah tujuan di layar Sesi Selesai.
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Data & Privasi</SectionLabel>
        <div className="border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-foreground">
              Semua data tersimpan di{' '}
              <span className="font-medium">Browser IndexedDB (perangkat ini)</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/settings/export"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-foreground hover:bg-neutral-100"
            >
              <Download aria-hidden className="h-4 w-4" />
              Ekspor semua data sebagai JSON
            </Link>
            <Link
              href="/settings/export"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-foreground hover:bg-neutral-100"
            >
              <Upload aria-hidden className="h-4 w-4" />
              Impor file backup
            </Link>
          </div>

          <Separator />

          <div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 aria-hidden />
              Hapus semua data
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <SectionLabel>Tentang</SectionLabel>
        <div className="text-sm text-muted-foreground">
          JadiMikir v0.1.0 · Local-only · Tidak perlu akun
        </div>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus semua data?</DialogTitle>
            <DialogDescription>
              Semua progres belajar, XP, streak, dan pengaturan akan dihapus permanen.
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteAll}>
              <AlertTriangle aria-hidden />
              Ya, hapus semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
