import { useEffect, useRef, useState } from 'react'
import { Grade, gradeReview, type ReviewGrade } from '../../domain/card'
import type { CardRepository, DueReview } from '../../data/cardRepository'
import { Flashcard } from '../../components/Flashcard'

const EXIT_TRANSITION_MS = 300

interface StudySessionProps {
  repository: CardRepository
}

const GRADE_OPTIONS: { grade: ReviewGrade; label: string; className: string }[] = [
  { grade: Grade.Again, label: 'Again', className: 'bg-jindo-terracotta' },
  { grade: Grade.Hard, label: 'Hard', className: 'bg-jindo-charcoal' },
  { grade: Grade.Good, label: 'Good', className: 'bg-jindo-blue' },
  { grade: Grade.Easy, label: 'Easy', className: 'bg-jindo-sage' },
]

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function StudySession({ repository }: StudySessionProps) {
  const [queue, setQueue] = useState<DueReview[]>(() => repository.getDueReviews())
  const [isFlipped, setIsFlipped] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isGradingRef = useRef(false)

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        clearTimeout(exitTimeoutRef.current)
      }
    }
  }, [])

  const currentReview = queue[0]

  function handleGrade(grade: ReviewGrade) {
    if (!currentReview || isGradingRef.current) return
    isGradingRef.current = true
    const gradedReview = currentReview
    repository.saveReviewable(gradeReview(gradedReview.reviewable, grade))
    setIsExiting(true)
    exitTimeoutRef.current = setTimeout(() => {
      setQueue((prev) =>
        prev.filter(
          (review) =>
            !(
              review.card.id === gradedReview.card.id &&
              review.reviewable.direction === gradedReview.reviewable.direction
            ),
        ),
      )
      setIsFlipped(false)
      setIsExiting(false)
      isGradingRef.current = false
    }, EXIT_TRANSITION_MS)
  }

  function handleShuffle() {
    if (isExiting) return
    setQueue((prev) => shuffle(prev))
    setIsFlipped(false)
  }

  if (!currentReview) {
    return (
      <div className="flex min-h-64 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center shadow-lg">
        <h2 className="font-heading text-lg font-medium text-jindo-charcoal">All caught up!</h2>
        <p className="text-sm text-jindo-charcoal/70">No cards due for review right now.</p>
      </div>
    )
  }

  const { card, reviewable } = currentReview

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={handleShuffle}
        disabled={isExiting}
        className="rounded-full border border-jindo-blue px-4 py-1.5 text-sm font-medium text-jindo-blue transition-colors hover:bg-jindo-blue/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Shuffle
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExiting ? 'translate-x-32 opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <Flashcard
          key={`${card.id}-${reviewable.direction}`}
          korean={card.korean}
          english={card.english}
          example={card.example}
          direction={reviewable.direction}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((flipped) => !flipped)}
        />
      </div>
      {isFlipped && (
        <div className="flex gap-3">
          {GRADE_OPTIONS.map(({ grade, label, className }) => (
            <button
              key={label}
              type="button"
              disabled={isExiting}
              onClick={() => handleGrade(grade)}
              className={`rounded-full px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
