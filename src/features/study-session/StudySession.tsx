import { useState } from 'react'
import { Grade, gradeReview, type ScheduledCard } from '../../domain/card'
import type { CardRepository } from '../../data/cardRepository'
import { Flashcard } from '../../components/Flashcard'

interface StudySessionProps {
  repository: CardRepository
}

type ReviewGrade = Exclude<Grade, Grade.Manual>

const GRADE_OPTIONS: { grade: ReviewGrade; label: string; className: string }[] = [
  { grade: Grade.Again, label: 'Again', className: 'bg-jindo-terracotta' },
  { grade: Grade.Hard, label: 'Hard', className: 'bg-jindo-charcoal' },
  { grade: Grade.Good, label: 'Good', className: 'bg-jindo-blue' },
  { grade: Grade.Easy, label: 'Easy', className: 'bg-jindo-sage' },
]

export function StudySession({ repository }: StudySessionProps) {
  const [queue, setQueue] = useState<ScheduledCard[]>(() => repository.getDue())
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = queue[0]

  function handleGrade(grade: ReviewGrade) {
    if (!currentCard) return
    repository.save(gradeReview(currentCard, grade))
    setQueue((prev) => prev.slice(1))
    setIsFlipped(false)
  }

  if (!currentCard) {
    return (
      <div className="flex min-h-64 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-lg font-medium text-jindo-charcoal">All caught up!</p>
        <p className="text-sm text-jindo-charcoal/70">No cards due for review right now.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Flashcard
        korean={currentCard.korean}
        english={currentCard.english}
        example={currentCard.example}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((flipped) => !flipped)}
      />
      {isFlipped && (
        <div className="flex gap-3">
          {GRADE_OPTIONS.map(({ grade, label, className }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleGrade(grade)}
              className={`rounded-full px-5 py-2 text-sm font-medium text-white ${className}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
