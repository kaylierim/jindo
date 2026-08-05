export interface SessionSegment {
  id: string
  label: string
  durationSeconds: number
  note?: string
}

export interface SessionState {
  segments: SessionSegment[]
  currentIndex: number
  remainingSeconds: number
  status: 'running' | 'paused' | 'complete'
}

export function createSessionState(segments: SessionSegment[]): SessionState {
  if (segments.length === 0) {
    return {
      segments,
      currentIndex: 0,
      remainingSeconds: 0,
      status: 'complete',
    }
  }

  return {
    segments,
    currentIndex: 0,
    remainingSeconds: segments[0].durationSeconds,
    status: 'running',
  }
}

export function tick(state: SessionState): SessionState {
  if (state.status !== 'running') {
    return state
  }

  if (state.remainingSeconds > 0) {
    return { ...state, remainingSeconds: state.remainingSeconds - 1 }
  }

  return advance(state)
}

export function advance(state: SessionState): SessionState {
  if (state.status === 'complete') {
    return state
  }

  const nextIndex = state.currentIndex + 1
  const nextSegment = state.segments[nextIndex]

  if (!nextSegment) {
    return { ...state, remainingSeconds: 0, status: 'complete' }
  }

  return {
    ...state,
    currentIndex: nextIndex,
    remainingSeconds: nextSegment.durationSeconds,
  }
}

export function togglePause(state: SessionState): SessionState {
  if (state.status === 'running') {
    return { ...state, status: 'paused' }
  }
  if (state.status === 'paused') {
    return { ...state, status: 'running' }
  }
  return state
}

export function currentSegment(state: SessionState): SessionSegment | undefined {
  return state.segments[state.currentIndex]
}

export function restartSegment(state: SessionState): SessionState {
  const segment = currentSegment(state)
  if (!segment) {
    return state
  }

  return { ...state, remainingSeconds: segment.durationSeconds, status: 'running' }
}

export function restartSession(state: SessionState): SessionState {
  return createSessionState(state.segments)
}
