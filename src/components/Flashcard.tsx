interface FlashcardProps {
  korean: string
  english: string
  example: string
  isFlipped: boolean
  onFlip: () => void
}

export function Flashcard({ korean, english, example, isFlipped, onFlip }: FlashcardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className="flex min-h-64 w-full max-w-sm flex-col items-center justify-center gap-3 rounded-2xl border border-jindo-blue/20 bg-white p-8 text-center shadow-lg"
    >
      <p className="text-3xl font-medium text-jindo-charcoal">{korean}</p>
      {isFlipped && (
        <div className="mt-4 space-y-2 border-t border-jindo-blue/20 pt-4">
          <p className="text-xl text-jindo-blue">{english}</p>
          <p className="text-sm text-jindo-charcoal/70 italic">{example}</p>
        </div>
      )}
    </button>
  )
}
