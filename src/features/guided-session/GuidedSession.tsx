import { useMemo, useState } from 'react'
import { SavedSessionsList } from './SavedSessionsList'
import { SegmentBuilder } from './SegmentBuilder'
import { SessionRunner } from './SessionRunner'
import { createSessionState, type SessionSegment, type SessionState } from './sessionPlan'
import { LocalStorageSessionTemplateRepository } from './sessionTemplateStore'

const DEFAULT_SEGMENTS: SessionSegment[] = [
  { id: 'warm-up', label: 'Warm up', durationSeconds: 5 * 60 },
  {
    id: 'speaking-practice',
    label: 'Speaking practice',
    durationSeconds: 10 * 60,
    note: 'e.g. describe your day using past tense',
  },
  { id: 'vocabulary-study', label: 'Vocabulary study', durationSeconds: 15 * 60 },
]

type View = 'select' | 'build' | 'run'

export function GuidedSession() {
  const templateRepository = useMemo(() => new LocalStorageSessionTemplateRepository(), [])
  const [view, setView] = useState<View>('select')
  const [segments, setSegments] = useState<SessionSegment[]>(DEFAULT_SEGMENTS)
  const [sessionState, setSessionState] = useState<SessionState | null>(null)

  if (view === 'run' && sessionState) {
    return (
      <SessionRunner
        state={sessionState}
        onStateChange={setSessionState}
        onEditPlan={() => setView('select')}
      />
    )
  }

  if (view === 'build') {
    return (
      <SegmentBuilder
        segments={segments}
        onChange={setSegments}
        onStart={() => {
          setSessionState(createSessionState(segments))
          setView('run')
        }}
        templateRepository={templateRepository}
        onBack={() => setView('select')}
      />
    )
  }

  return (
    <SavedSessionsList
      templateRepository={templateRepository}
      onStart={(template) => {
        setSessionState(createSessionState(template.segments))
        setView('run')
      }}
      onCreateCustom={() => {
        setSegments(DEFAULT_SEGMENTS)
        setView('build')
      }}
    />
  )
}
