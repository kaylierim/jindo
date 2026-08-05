import type { SessionSegment } from './sessionPlan'

interface SegmentBuilderProps {
  segments: SessionSegment[]
  onChange: (segments: SessionSegment[]) => void
  onStart: () => void
}

function isValidSegment(segment: SessionSegment): boolean {
  return segment.label.trim().length > 0 && segment.durationSeconds > 0
}

export function SegmentBuilder({ segments, onChange, onStart }: SegmentBuilderProps) {
  const totalMinutes = segments.reduce(
    (sum, segment) => sum + segment.durationSeconds / 60,
    0,
  )
  const canStart = segments.length > 0 && segments.every(isValidSegment)

  function updateSegment(id: string, patch: Partial<SessionSegment>) {
    onChange(
      segments.map((segment) =>
        segment.id === id ? { ...segment, ...patch } : segment,
      ),
    )
  }

  function removeSegment(id: string) {
    onChange(segments.filter((segment) => segment.id !== id))
  }

  function addSegment() {
    onChange([
      ...segments,
      {
        id: crypto.randomUUID(),
        label: '',
        durationSeconds: 5 * 60,
      },
    ])
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg">
      <h2 className="font-heading text-lg font-medium text-jindo-charcoal">Plan your session</h2>

      <div className="flex flex-col gap-4">
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            className="flex flex-col gap-2 rounded-lg border border-jindo-blue/20 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                value={segment.label}
                onChange={(event) =>
                  updateSegment(segment.id, { label: event.target.value })
                }
                placeholder={`Segment ${index + 1} label`}
                className="min-w-0 flex-1 rounded-lg border border-jindo-blue/20 px-3 py-2 text-base"
              />
              <button
                type="button"
                onClick={() => removeSegment(segment.id)}
                aria-label="Remove segment"
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-jindo-terracotta"
              >
                Remove
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-jindo-charcoal">
              Minutes
              <input
                type="number"
                min={1}
                value={segment.durationSeconds / 60}
                onChange={(event) => {
                  const minutes = Number(event.target.value)
                  if (!Number.isFinite(minutes)) return
                  updateSegment(segment.id, {
                    durationSeconds: Math.max(0, minutes) * 60,
                  })
                }}
                className="w-20 rounded-lg border border-jindo-blue/20 px-3 py-2 text-base"
              />
            </label>
            <input
              value={segment.note ?? ''}
              onChange={(event) =>
                updateSegment(segment.id, { note: event.target.value })
              }
              placeholder="Optional note shown during this segment"
              className="rounded-lg border border-jindo-blue/20 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSegment}
        className="rounded-full border border-jindo-blue px-4 py-2 text-sm font-medium text-jindo-blue"
      >
        + Add segment
      </button>

      <p className="text-sm text-jindo-charcoal/70">
        Total planned time: {totalMinutes} min
      </p>

      <button
        type="button"
        disabled={!canStart}
        onClick={onStart}
        className="mt-2 rounded-full bg-jindo-blue px-5 py-2 text-sm font-medium text-white disabled:bg-jindo-blue/40"
      >
        Start session
      </button>
    </div>
  )
}
