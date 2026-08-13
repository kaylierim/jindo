import type { VocabCard } from "../../domain/card";

export interface CardEditValues {
  korean: string;
  english: string;
  example: string;
}

interface EditableCardRowProps {
  card: VocabCard;
  isExpanded: boolean;
  editValues: CardEditValues | null;
  onToggleExpand: () => void;
  onEditChange: (field: keyof CardEditValues, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleProduction: (enabled: boolean) => void;
  onDelete: () => void;
}

export function EditableCardRow({
  card,
  isExpanded,
  editValues,
  onToggleExpand,
  onEditChange,
  onSave,
  onCancel,
  onToggleProduction,
  onDelete,
}: EditableCardRowProps) {
  return (
    <li className="flex flex-col gap-2 py-2">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-controls={`card-edit-${card.id}`}
          className="flex flex-1 items-center gap-2 text-left text-sm text-jindo-charcoal"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`h-4 w-4 flex-shrink-0 text-jindo-charcoal/50 transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          >
            <path d="M7 4l6 6-6 6" />
          </svg>
          <span>
            <span className="font-korean">{card.korean}</span> — {card.english}
          </span>
        </button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-jindo-charcoal/70">
            <input
              type="checkbox"
              checked={card.productionEnabled}
              onChange={(event) => onToggleProduction(event.target.checked)}
              className="h-4 w-4 rounded border-jindo-blue/20"
            />
            Practice production
          </label>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs font-medium text-jindo-terracotta"
          >
            Delete
          </button>
        </div>
      </div>
      {isExpanded && editValues && (
        <div id={`card-edit-${card.id}`} className="flex flex-col gap-3 rounded-xl bg-jindo-cream/30 p-3">
          <label className="flex flex-col gap-1 text-left text-xs text-jindo-charcoal">
            Korean word
            <input
              value={editValues.korean}
              onChange={(event) => onEditChange("korean", event.target.value)}
              className="rounded-lg border border-jindo-blue/20 px-3 py-2 font-korean text-base"
            />
          </label>
          <label className="flex flex-col gap-1 text-left text-xs text-jindo-charcoal">
            English meaning
            <input
              value={editValues.english}
              onChange={(event) => onEditChange("english", event.target.value)}
              className="rounded-lg border border-jindo-blue/20 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-1 text-left text-xs text-jindo-charcoal">
            Example sentence
            <input
              value={editValues.example}
              onChange={(event) => onEditChange("example", event.target.value)}
              className="rounded-lg border border-jindo-blue/20 px-3 py-2 font-korean text-base"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSave}
              className="rounded-full bg-jindo-blue px-4 py-1.5 text-xs font-medium text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-jindo-charcoal/60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
