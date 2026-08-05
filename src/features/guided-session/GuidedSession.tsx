import { useState } from 'react'
import { SegmentBuilder } from './SegmentBuilder'
import { SessionRunner } from './SessionRunner'
import { createSessionState, type SessionSegment, type SessionState } from './sessionPlan'

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

export function GuidedSession() {
  const [segments, setSegments] = useState<SessionSegment[]>(DEFAULT_SEGMENTS)
  const [sessionState, setSessionState] = useState<SessionState | null>(null)

  if (sessionState) {
    return (
      <SessionRunner
        state={sessionState}
        onStateChange={setSessionState}
        onEditPlan={() => setSessionState(null)}
      />
    )
  }

  return (
    <SegmentBuilder
      segments={segments}
      onChange={setSegments}
      onStart={() => setSessionState(createSessionState(segments))}
    />
  )
}
