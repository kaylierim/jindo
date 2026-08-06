import { useState } from 'react'
import type { SessionTemplate, SessionTemplateRepository } from './sessionTemplateStore'

interface SavedSessionsListProps {
  templateRepository: SessionTemplateRepository
  onStart: (template: SessionTemplate) => void
  onCreateCustom: () => void
}

function summarize(template: SessionTemplate): string {
  const totalMinutes = template.segments.reduce(
    (sum, segment) => sum + segment.durationSeconds / 60,
    0,
  )
  const segmentCount = template.segments.length
  const segmentLabel = segmentCount === 1 ? 'segment' : 'segments'
  return `${segmentCount} ${segmentLabel} · ${totalMinutes} min`
}

export function SavedSessionsList({
  templateRepository,
  onStart,
  onCreateCustom,
}: SavedSessionsListProps) {
  const [templates, setTemplates] = useState<SessionTemplate[]>(() =>
    templateRepository.getAll(),
  )

  function handleDelete(id: string) {
    templateRepository.delete(id)
    setTemplates(templateRepository.getAll())
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg">
      <h2 className="font-heading text-lg font-medium text-jindo-charcoal">Guided sessions</h2>

      {templates.length === 0 ? (
        <p className="text-sm text-jindo-charcoal/70">No saved sessions yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-jindo-blue/10">
          {templates.map((template) => (
            <li key={template.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-jindo-charcoal">{template.name}</span>
                <span className="text-xs text-jindo-charcoal/70">{summarize(template)}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => onStart(template)}
                  className="rounded-full bg-jindo-blue px-4 py-2 text-sm font-medium text-white"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(template.id)}
                  className="text-xs font-medium text-jindo-terracotta"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onCreateCustom}
        className="mt-2 rounded-full border border-jindo-blue px-4 py-2 text-sm font-medium text-jindo-blue"
      >
        + Create custom session
      </button>
    </div>
  )
}
