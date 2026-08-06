import { useEffect, useRef } from 'react'
import {
  advance,
  currentSegment,
  restartSegment,
  restartSession,
  tick,
  togglePause,
  type SessionState,
} from './sessionPlan'

interface SessionRunnerProps {
  state: SessionState
  onStateChange: (state: SessionState) => void
  onEditPlan: () => void
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function SessionRunner({ state, onStateChange, onEditPlan }: SessionRunnerProps) {
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (state.status !== 'running') return

    const intervalId = setInterval(() => {
      onStateChange(tick(stateRef.current))
    }, 1000)

    return () => clearInterval(intervalId)
    // Only restart the interval when status actually changes (running/paused/complete),
    // not on every tick — stateRef.current keeps the callback reading fresh state instead.
  }, [state.status, onStateChange])

  if (state.status === 'complete') {
    return (
      <div className="flex min-h-64 w-full max-w-sm flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 text-center shadow-lg">
        <h2 className="font-heading text-lg font-medium text-jindo-charcoal">Session complete!</h2>
        <p className="text-sm text-jindo-charcoal/70">
          Nice work getting through your plan.
        </p>
        <button
          type="button"
          onClick={onEditPlan}
          className="rounded-full bg-jindo-blue px-5 py-2 text-sm font-medium text-white"
        >
          Back to sessions
        </button>
      </div>
    )
  }

  const segment = currentSegment(state)
  if (!segment) return null

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-jindo-blue/20 bg-white p-8 text-center shadow-lg">
      <p className="text-sm font-medium text-jindo-charcoal/70">
        Segment {state.currentIndex + 1} of {state.segments.length}
      </p>
      <p className="text-2xl font-medium text-jindo-charcoal">{segment.label}</p>
      {segment.note && (
        <p className="text-sm italic text-jindo-blue">{segment.note}</p>
      )}
      <p className="text-5xl font-semibold text-jindo-terracotta">
        {formatTime(state.remainingSeconds)}
      </p>
      <button
        type="button"
        onClick={() => onStateChange(togglePause(state))}
        className="rounded-full bg-jindo-blue px-5 py-2 text-sm font-medium text-white"
      >
        {state.status === 'running' ? 'Pause' : 'Resume'}
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onStateChange(restartSegment(state))}
          className="rounded-full border border-jindo-blue px-4 py-2 text-sm font-medium text-jindo-blue"
        >
          Restart segment
        </button>
        <button
          type="button"
          onClick={() => onStateChange(advance(state))}
          className="rounded-full border border-jindo-blue px-4 py-2 text-sm font-medium text-jindo-blue"
        >
          Skip
        </button>
      </div>
      <button
        type="button"
        onClick={() => onStateChange(restartSession(state))}
        className="text-xs font-medium text-jindo-terracotta underline"
      >
        Restart session
      </button>
    </div>
  )
}
