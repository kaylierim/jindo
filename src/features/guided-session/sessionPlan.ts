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

export function tick(state: SessionState, elapsedSeconds: number = 1): SessionState {
  if (state.status !== 'running') return state

  let remaining = elapsedSeconds
  let current = state

  while (remaining > 0) {
    if (current.remainingSeconds > remaining) {
      return { ...current, remainingSeconds: current.remainingSeconds - remaining }
    }
    remaining -= current.remainingSeconds
    current = advance(current)
    if (current.status !== 'running') return current
  }

  return current
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
