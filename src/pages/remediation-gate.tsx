import { useMemo } from 'react'
import { useSearch, useLocation } from 'wouter'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTopicQuery, useTopicsQuery } from '@/lib/content'
import { learnerStore } from '@/store/learnerStore'

export function RemediationGatePage() {
  const [, navigate] = useLocation()
  const search = useSearch()
  
  const params = useMemo(() => {
    const sp = new URLSearchParams(search)
    return {
      prereqTopicId: sp.get('topicId') ?? '',
      fromTopicId: sp.get('fromTopic') ?? '',
      questionIndex: parseInt(sp.get('questionIndex') ?? '0', 10),
      tag: sp.get('tag') ?? null,
    }
  }, [search])

  const { data: prereqTopic } = useTopicQuery(params.prereqTopicId)
  const { data: allTopics = [] } = useTopicsQuery()

  const fromTopicTitle = useMemo(() => {
    return allTopics.find(t => t.id === params.fromTopicId)?.title ?? 'Sesi sebelumnya'
  }, [allTopics, params.fromTopicId])

  const failureCount = useMemo(() => {
    const state = learnerStore.get()
    const prereqId = params.prereqTopicId
    const failures = state.reviewLogs.filter(
      log => log.questionId.includes(prereqId) && log.rating === 'again'
    ).slice(-5)
    return failures.length || 1
  }, [params.prereqTopicId])

  const estimateQuestions = 8
  const estimateMinutes = 5

  const handleStartDrill = () => {
    const qs = new URLSearchParams({
      topicId: params.prereqTopicId,
      fromTopic: params.fromTopicId,
      questionIndex: String(params.questionIndex),
    })
    if (params.tag) qs.set('tag', params.tag)
    navigate(`/remediation/drill?${qs.toString()}`)
  }

  const handleSkip = () => {
    if (params.fromTopicId) {
      const qs = new URLSearchParams({
        resumeAt: String(params.questionIndex + 1),
      })
      if (params.tag) qs.set('tag', params.tag)
      navigate(`/session/${params.fromTopicId}?${qs.toString()}`)
    } else {
      navigate(`/`)
    }
  }

  const prereqTitle = prereqTopic?.title ?? 'topik prasyarat'

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSkip}
          className="cursor-pointer text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          {params.fromTopicId ? '← Kembali ke sesi' : '← Kembali'}
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{fromTopicTitle}{params.tag ? ` · ${params.tag}` : ''}</span>
        <span>·</span>
        <span>Soal {params.questionIndex + 1}</span>
      </div>

      <Card className="border-border bg-surface-raised">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-primary mt-1 size-8 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <h1 className="text-foreground text-xl font-semibold">
                Ada celah yang perlu ditutup
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground text-base leading-relaxed">
            Kamu melewatkan {failureCount} soal yang mengandalkan {prereqTitle}.
            Latihan singkat ini akan membantu sebelum kamu lanjut.
          </p>

          <p className="text-muted-foreground text-sm">
            Perkiraan: ~{estimateMinutes} menit · {estimateQuestions} soal terarah
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleStartDrill} className="sm:min-w-44">
              Mulai Latihan Singkat
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button variant="outline" onClick={handleSkip} className="sm:min-w-44">
              Lewati untuk sekarang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
