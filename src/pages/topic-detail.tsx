import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { Link, useLocation, useRoute, useSearch } from 'wouter'
import { ArrowLeft, ArrowRight, AlertTriangle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionLabel } from '@/components/ui/section-label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { MasteryGatePanel } from '@/components/mastery/mastery-gate-panel'
import { useQuestionsQuery, useTopicQuery, useTopicsQuery } from '@/lib/content'
import { useTopicBrowserData, toSlug } from '@/lib/hooks/use-topic-browser'
import type { TopicWithStatus } from '@/lib/hooks/use-topic-browser'
import {
  buildSubtopicRows,
  findWeakestSubtopicTag,
  getCardBucketStats,
  getUnlockTopics,
} from '@/lib/topic-detail-aggregates'
import {
  countCardsNeedingWork,
  getTwoWeakestSubtopics,
} from '@/lib/mastery-gate-aggregates'
import { learnerStore, learnerActions } from '@/store/learnerStore'

function statusLabel(status: TopicWithStatus['status']): string {
  switch (status) {
    case 'locked':
      return 'Terkunci'
    case 'available':
      return 'Siap mulai'
    case 'inProgress':
      return 'Berlangsung'
    case 'mastered':
      return 'Selesai'
    default:
      return '—'
  }
}

function TopicDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-64 max-w-full" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  )
}

export function TopicDetailPage() {
  const [, params] = useRoute<{ subject: string; topicId: string }>('/topics/:subject/:topicId')
  const subjectSlug = params?.subject ?? ''
  const topicId = params?.topicId ?? ''
  const [, navigate] = useLocation()
  const search = useSearch()

  const headingRef = useRef<HTMLHeadingElement>(null)
  const { data: topic, isLoading: topicLoading, isError: topicError } = useTopicQuery(topicId)
  const { data: questions = [], isLoading: questionsLoading } = useQuestionsQuery(topicId)
  const { data: allTopics = [] } = useTopicsQuery()
  const { getTopicsBySubject } = useTopicBrowserData()
  const [learnerState, setLearnerState] = useState(() => learnerStore.get())
  useEffect(() => {
    const sub = learnerStore.subscribe((s) => setLearnerState(s))
    return () => sub.unsubscribe()
  }, [])

  const [resetOpen, setResetOpen] = useState(false)

  const topicStatus = useMemo(() => {
    if (!topic) return null
    const cat = getTopicsBySubject(topic.subject)
    const merged = [...cat.inProgress, ...cat.mastered, ...cat.available, ...cat.locked]
    return merged.find((t) => t.id === topic.id) ?? null
  }, [topic, getTopicsBySubject])

  const expectedSlug = topic ? toSlug(topic.subject) : ''

  /** Preserve e.g. `from=home` when correcting subject slug in the URL. */
  const querySuffix = useMemo(() => {
    const q = search.startsWith('?') ? search.slice(1) : search
    return q ? `?${q}` : ''
  }, [search])

  const backHref = useMemo(() => {
    const q = search.startsWith('?') ? search.slice(1) : search
    const from = new URLSearchParams(q).get('from')
    if (from === 'home') return '/'
    if (from === 'progress') return '/progress'
    return `/topics/${expectedSlug}`
  }, [search, expectedSlug])

  useEffect(() => {
    if (!topic || !topicId) return
    if (subjectSlug !== expectedSlug) {
      navigate(`/topics/${expectedSlug}/${topicId}${querySuffix}`, { replace: true })
    }
  }, [topic, subjectSlug, expectedSlug, topicId, navigate, querySuffix])

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions])

  const cardBuckets = useMemo(
    () => getCardBucketStats(questionIds, learnerState.cards),
    [questionIds, learnerState.cards],
  )

  const subtopicRows = useMemo(
    () => buildSubtopicRows(questions, learnerState.reviewLogs),
    [questions, learnerState.reviewLogs],
  )

  const weakTag = useMemo(() => findWeakestSubtopicTag(subtopicRows), [subtopicRows])

  const unlocks = useMemo(
    () => (topicId ? getUnlockTopics(topicId, allTopics, toSlug) : []),
    [topicId, allTopics],
  )

  const gateThreshold = learnerState.masteryGateThresholdPercent ?? 70
  const gateFocus = useMemo(() => {
    const q = search.startsWith('?') ? search.slice(1) : search
    return new URLSearchParams(q).get('gate') === '1'
  }, [search])

  const masteryPct = topicStatus?.masteryProgress?.current ?? 0
  const showMasteryGate =
    topicStatus?.status === 'inProgress' &&
    unlocks.length > 0 &&
    masteryPct < gateThreshold

  const cardsNeedingWork = useMemo(
    () => countCardsNeedingWork(questionIds, learnerState.cards),
    [questionIds, learnerState.cards],
  )

  const weakestTwo = useMemo(() => getTwoWeakestSubtopics(subtopicRows), [subtopicRows])
  const showProgressBar =
    topicStatus?.status === 'mastered' ||
    (topicStatus?.status === 'inProgress' && masteryPct > 0)

  const sessionHref = useMemo(() => {
    const base = weakTag
      ? `/session/${topicId}?tag=${encodeURIComponent(weakTag)}`
      : `/session/${topicId}`
    const q = querySuffix.startsWith('?') ? querySuffix.slice(1) : querySuffix
    if (!q) return base
    const sep = base.includes('?') ? '&' : '?'
    return `${base}${sep}${q}`
  }, [topicId, weakTag, querySuffix])

  const sessionHrefPlain = useMemo(() => {
    const base = `/session/${topicId}`
    const q = querySuffix.startsWith('?') ? querySuffix.slice(1) : querySuffix
    if (!q) return base
    return `${base}?${q}`
  }, [topicId, querySuffix])

  const canStartSession = Boolean(topicStatus && topicStatus.status !== 'locked')

  const handleReset = () => {
    if (!topicId || questionIds.length === 0) return
    learnerActions.resetTopic(topicId, questionIds)
    setResetOpen(false)
  }

  useLayoutEffect(() => {
    document.title = topic
      ? `${topic.title} — Topik — JadiMikir`
      : 'Topik — JadiMikir'
    headingRef.current?.focus()
  }, [topic])

  const loading = topicLoading || questionsLoading

  if (loading) {
    return <TopicDetailSkeleton />
  }

  if (topicError || !topic) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-foreground text-xl font-semibold">Topik tidak ditemukan</h1>
        <p className="text-muted-foreground mt-2 text-sm">Periksa URL atau kembali ke daftar topik.</p>
        <Button variant="outline" size="sm" asChild className="mt-4">
          <Link href="/topics">Semua subjek</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={backHref}>
            <ArrowLeft aria-hidden />
            Kembali
          </Link>
        </Button>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-foreground min-w-0 flex-1 truncate text-xl font-semibold outline-none"
        >
          {topic.title}
        </h1>
      </div>

      {showMasteryGate && (
        <MasteryGatePanel
          topicId={topicId}
          querySuffix={querySuffix}
          masteryPct={masteryPct}
          thresholdPct={gateThreshold}
          unlockTopicTitles={unlocks.map((u) => u.topic.title)}
          cardsNeedingWork={cardsNeedingWork}
          weakestSubtopics={weakestTwo}
          focusOnMount={gateFocus}
        />
      )}

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Ringkasan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium">Penguasaan</span>
              <div className="flex items-center gap-3">
                {showProgressBar ? (
                  <Progress value={masteryPct} className="h-2 max-w-md flex-1" />
                ) : (
                  <div className="bg-border h-2 max-w-md flex-1 rounded-full" />
                )}
                <span className="text-foreground text-sm font-medium tabular-nums">{masteryPct}%</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-0.5 sm:text-right">
              <span className="text-muted-foreground text-xs font-medium">Status</span>
              <span className="text-sm font-medium">{topicStatus ? statusLabel(topicStatus.status) : '—'}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Kartu: {questions.length} soal · {cardBuckets.jatuhTempo} jatuh tempo · {cardBuckets.mendatang}{' '}
            mendatang · {cardBuckets.mastered} selesai review
            {cardBuckets.cardsTracked < questions.length && (
              <span className="block pt-1 text-xs">
                ({cardBuckets.cardsTracked} kartu FSRS terlacak — mulai sesi untuk membuat kartu baru)
              </span>
            )}
          </p>

          {topicStatus && topicStatus.status === 'locked' && topicStatus.prereqInfo.some((p) => !p.satisfied) && (
            <p className="text-muted-foreground text-sm">
              Butuh:{' '}
              {topicStatus.prereqInfo
                .filter((p) => !p.satisfied)
                .map((p, i) => (
                  <span key={p.topicId}>
                    {i > 0 && ', '}
                    <span className="text-destructive">✗</span> {p.title} ({p.currentPct}%)
                  </span>
                ))}
            </p>
          )}
          {topicStatus &&
            topicStatus.status !== 'locked' &&
            topicStatus.prereqInfo.length > 0 && (
              <p className="text-muted-foreground text-sm">
                Prasyarat:{' '}
                {topicStatus.prereqInfo.map((p, i) => (
                  <span key={p.topicId}>
                    {i > 0 && ', '}
                    <span className="text-success">
                      <Check className="inline size-3.5 align-text-bottom" aria-hidden />
                    </span>{' '}
                    {p.title}
                  </span>
                ))}
              </p>
            )}
        </CardContent>
      </Card>

      {/* Subtopics table */}
      <section className="flex flex-col gap-1">
        <SectionLabel>Subtopik</SectionLabel>
        <div className="border-border bg-surface-raised overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subtopik</TableHead>
                <TableHead className="text-right">Kartu</TableHead>
                <TableHead className="text-right">Akurasi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subtopicRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground text-sm">
                    Tidak ada subtopik (tambahkan tag pada soal di konten).
                  </TableCell>
                </TableRow>
              ) : (
                subtopicRows.map((row) => (
                  <TableRow key={row.tagKey}>
                    <TableCell className="font-medium">{row.displayLabel}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.questionCount}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.accuracyPercent === null ? '—' : `${row.accuracyPercent}%`}
                    </TableCell>
                    <TableCell>
                      {row.status === 'weak' && (
                        <span className="text-destructive inline-flex items-center gap-1 text-sm">
                          <AlertTriangle className="size-4 shrink-0" aria-hidden />
                          Perlu latihan
                        </span>
                      )}
                      {row.status === 'strong' && (
                        <span className="text-success text-sm">Kuat</span>
                      )}
                      {row.status === 'ok' && (
                        <span className="text-muted-foreground text-sm">Oke</span>
                      )}
                      {row.status === 'empty' && (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Unlocks */}
      {unlocks.length > 0 && (
        <section className="flex flex-col gap-1">
          <SectionLabel>Membuka topik baru</SectionLabel>
          <Card>
            <CardContent className="text-muted-foreground flex flex-col gap-3 p-4 text-sm">
              <p className="text-foreground font-medium">Menguasai topik ini membuka:</p>
              <ul className="flex flex-col gap-2">
                {unlocks.map(({ topic: u, subjectSlug: slug }) => (
                  <li
                    key={u.id}
                    className="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-foreground min-w-0">→ {u.title}</span>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/topics/${slug}/${u.id}${querySuffix}`}>Lihat</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/session/${u.id}${querySuffix}`}>
                          Mulai
                          <ArrowRight className="size-4" aria-hidden />
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Primary CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button className="sm:min-w-40" disabled={!canStartSession} asChild={canStartSession}>
          {canStartSession ? (
            <Link href={sessionHrefPlain}>
              Mulai sesi
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <span>Terkunci</span>
          )}
        </Button>
        <Button
          variant="outline"
          className="sm:min-w-40"
          disabled={!canStartSession || !weakTag}
          asChild={canStartSession && !!weakTag}
        >
          {canStartSession && weakTag ? (
            <Link href={sessionHref}>
              Latih subtopik lemah
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <span>Latih subtopik lemah</span>
          )}
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10 self-start"
          onClick={() => setResetOpen(true)}
        >
          Reset topik
        </Button>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Reset topik ini?</DialogTitle>
            <DialogDescription className="text-muted-foreground space-y-2 pt-1">
              <span className="block">
                Semua progres kartu FSRS akan dihapus permanen untuk topik ini.
              </span>
              <span className="block">Tindakan ini tidak dapat dibatalkan.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setResetOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleReset}>
              Ya, reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
